<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function validation_error(string $field = 'form'): void
{
    respond(['ok' => false, 'code' => 'VALIDATION_ERROR', 'field' => $field], 422);
}

function is_https_request(): bool
{
    $https = $_SERVER['HTTPS'] ?? '';
    $forwardedProto = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '';

    return $https !== '' && strtolower((string) $https) !== 'off'
        || strtolower((string) $forwardedProto) === 'https';
}

function load_config(): array
{
    $siteRoot = dirname(__DIR__);
    $projectRoot = dirname(__DIR__, 2);
    $sitePrivateRoot = $siteRoot . '/private';
    $projectPrivateRoot = $projectRoot . '/private';
    $configFiles = array_filter([
        getenv('KAI_CONTACT_CONFIG_PATH') ?: '',
        $sitePrivateRoot . '/kai-contact-config.php',
        $projectPrivateRoot . '/kai-contact-config.php',
    ]);
    $defaults = [
        'resend_api_key' => getenv('RESEND_API_KEY') ?: '',
        'turnstile_secret_key' => getenv('TURNSTILE_SECRET_KEY') ?: '',
        'contact_to_email' => getenv('CONTACT_TO_EMAIL') ?: 'kaimaisonberlin@gmail.com',
        'contact_from_email' => getenv('CONTACT_FROM_EMAIL') ?: 'Kai Maison <contact@kaimaison.de>',
        'allowed_origins' => [],
        'storage_dir' => getenv('KAI_CONTACT_STORAGE_DIR') ?: $sitePrivateRoot . '/kai-contact',
        'rate_limit_salt' => getenv('KAI_CONTACT_RATE_LIMIT_SALT') ?: '',
        'cookie_secure' => is_https_request(),
    ];

    foreach ($configFiles as $configFile) {
        if (!is_file($configFile)) continue;

        $fileConfig = require $configFile;
        if (is_array($fileConfig)) {
            return array_replace($defaults, $fileConfig);
        }
    }

    return $defaults;
}

function validate_origin(array $config): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') return;

    $allowed = $config['allowed_origins'] ?? [];
    if (!$allowed) {
        $host = $_SERVER['HTTP_HOST'] ?? '';
        if ($host !== '') {
            $allowed[] = (is_https_request() ? 'https://' : 'http://') . $host;
        }
    }

    if (!in_array($origin, $allowed, true)) {
        respond(['ok' => false, 'code' => 'VALIDATION_ERROR'], 403);
    }
}

function clean_string(mixed $value, int $maxLength): string
{
    if (!is_string($value)) return '';

    $value = trim($value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value) ?? '';

    return strlen($value) > $maxLength ? substr($value, 0, $maxLength) : $value;
}

function get_payload(): array
{
    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($contentLength > 20000) {
        respond(['ok' => false, 'code' => 'VALIDATION_ERROR'], 413);
    }

    $raw = file_get_contents('php://input');
    $payload = json_decode($raw ?: '', true);

    if (!is_array($payload)) {
        respond(['ok' => false, 'code' => 'VALIDATION_ERROR'], 400);
    }

    return $payload;
}

function get_client_ip(): string
{
    $cloudflareIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
    if (is_string($cloudflareIp) && filter_var($cloudflareIp, FILTER_VALIDATE_IP)) {
        return $cloudflareIp;
    }

    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function get_device_id(array $config): string
{
    $deviceId = $_COOKIE['kai_device_id'] ?? '';
    if (!is_string($deviceId) || !preg_match('/^[a-f0-9]{32}$/', $deviceId)) {
        $deviceId = bin2hex(random_bytes(16));
    }

    setcookie('kai_device_id', $deviceId, [
        'expires' => time() + 15552000,
        'path' => '/',
        'secure' => (bool) ($config['cookie_secure'] ?? true),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    return $deviceId;
}

function ensure_storage(string $storageDir): void
{
    if (!is_dir($storageDir) && !mkdir($storageDir, 0750, true) && !is_dir($storageDir)) {
        respond(['ok' => false, 'code' => 'MAIL_FAILED'], 500);
    }

    $submissionsDir = $storageDir . '/submissions';
    if (!is_dir($submissionsDir) && !mkdir($submissionsDir, 0750, true) && !is_dir($submissionsDir)) {
        respond(['ok' => false, 'code' => 'MAIL_FAILED'], 500);
    }
}

function hash_key(string $prefix, string $value, array $config): string
{
    $salt = (string) ($config['rate_limit_salt'] ?: $config['resend_api_key'] ?: __FILE__);
    return $prefix . ':' . hash_hmac('sha256', strtolower($value), $salt);
}

function is_rate_limited(string $storageDir, array $keys): bool
{
    $now = time();
    $counterPath = $storageDir . '/rate-limits.json';
    $lockPath = $storageDir . '/rate-limits.lock';
    $lock = fopen($lockPath, 'c+');

    if (!$lock || !flock($lock, LOCK_EX)) {
        respond(['ok' => false, 'code' => 'MAIL_FAILED'], 500);
    }

    $counters = [];
    if (is_file($counterPath)) {
        $decoded = json_decode((string) file_get_contents($counterPath), true);
        if (is_array($decoded)) $counters = $decoded;
    }

    foreach ($counters as $key => $timestamps) {
        if (!is_array($timestamps)) {
            unset($counters[$key]);
            continue;
        }

        $counters[$key] = array_values(array_filter(
            $timestamps,
            fn ($timestamp) => is_int($timestamp) && $timestamp > $now - 86400
        ));

        if (!$counters[$key]) unset($counters[$key]);
    }

    $rules = [
        [$keys['device'], 1800, 3],
        [$keys['device'], 86400, 8],
        [$keys['email'], 86400, 3],
        [$keys['ip'], 1800, 10],
        [$keys['ip'], 86400, 30],
    ];

    foreach ($rules as [$key, $windowSeconds, $max]) {
        $timestamps = $counters[$key] ?? [];
        $count = count(array_filter($timestamps, fn ($timestamp) => $timestamp > $now - $windowSeconds));
        if ($count >= $max) {
            file_put_contents($counterPath, json_encode($counters, JSON_UNESCAPED_SLASHES));
            flock($lock, LOCK_UN);
            fclose($lock);
            return true;
        }
    }

    foreach (array_unique(array_values($keys)) as $key) {
        $counters[$key] ??= [];
        $counters[$key][] = $now;
    }

    file_put_contents($counterPath, json_encode($counters, JSON_UNESCAPED_SLASHES));
    flock($lock, LOCK_UN);
    fclose($lock);

    return false;
}

function http_post(string $url, string $body, array $headers): array
{
    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
        ]);
        $responseBody = curl_exec($curl);
        $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        return ['status' => $status, 'body' => is_string($responseBody) ? $responseBody : ''];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => $body,
            'timeout' => 10,
            'ignore_errors' => true,
        ],
    ]);
    $responseBody = @file_get_contents($url, false, $context);
    $status = 0;

    foreach ($http_response_header ?? [] as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d+)/', $header, $matches)) {
            $status = (int) $matches[1];
            break;
        }
    }

    return ['status' => $status, 'body' => is_string($responseBody) ? $responseBody : ''];
}

function verify_turnstile(string $token, array $config): array
{
    $secret = (string) ($config['turnstile_secret_key'] ?? '');
    if ($secret === '' || $token === '') {
        return ['ok' => false, 'status' => 0, 'errors' => ['missing-secret-or-token'], 'hostname' => ''];
    }

    $response = http_post(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        http_build_query([
            'secret' => $secret,
            'response' => $token,
        ]),
        ['Content-Type: application/x-www-form-urlencoded']
    );
    $decoded = json_decode($response['body'], true);
    $ok = $response['status'] >= 200
        && $response['status'] < 300
        && is_array($decoded)
        && ($decoded['success'] ?? false) === true;

    return [
        'ok' => $ok,
        'status' => $response['status'],
        'errors' => is_array($decoded) ? ($decoded['error-codes'] ?? []) : ['invalid-json'],
        'hostname' => is_array($decoded) ? ($decoded['hostname'] ?? '') : '',
    ];
}

function form_type_labels(): array
{
    return [
        'contact' => 'Contact enquiry',
        'functions' => 'Functions and catering enquiry',
        'giftCard' => 'Gift card enquiry',
    ];
}

function detail_specs(string $formType): array
{
    $specs = [
        'functions' => [
            'eventDate' => ['label' => 'Date of Event', 'max' => 40],
            'budget' => ['label' => 'Budget', 'max' => 80],
            'guestCount' => ['label' => 'Approximate Number of People', 'max' => 80],
        ],
        'giftCard' => [
            'recipientName' => ['label' => 'Recipient Name', 'max' => 120, 'required' => true],
            'giftCardAmount' => ['label' => 'Gift Card Amount', 'max' => 40, 'required' => true],
        ],
    ];

    return $specs[$formType] ?? [];
}

function clean_details(mixed $rawDetails, string $formType): array
{
    if (!is_array($rawDetails)) {
        $rawDetails = [];
    }

    $details = [];
    foreach (detail_specs($formType) as $key => $spec) {
        $value = clean_string($rawDetails[$key] ?? '', (int) $spec['max']);
        if (($spec['required'] ?? false) && $value === '') {
            validation_error('details.' . $key);
        }

        if ($value !== '') {
            $details[] = [
                'label' => $spec['label'],
                'value' => $value,
            ];
        }
    }

    return $details;
}

function build_email_html(array $submission): string
{
    $rows = [
        'Request ID' => $submission['requestId'],
        'Device ID' => $submission['deviceId'],
        'Inquiry Type' => $submission['formLabel'],
        'Name' => $submission['firstName'] . ' ' . $submission['lastName'],
        'Email' => $submission['email'],
        'Phone' => $submission['phone'] ?: '-',
        'Submitted At' => $submission['submittedAt'],
    ];
    $html = '<h2>New Kai Maison ' . htmlspecialchars($submission['formLabel'], ENT_QUOTES, 'UTF-8') . '</h2><table cellpadding="8" cellspacing="0" border="0">';

    foreach ($rows as $label => $value) {
        $html .= '<tr><td><strong>' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . '</strong></td><td>'
            . nl2br(htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8')) . '</td></tr>';
    }

    $html .= '</table><h3>Message</h3><p>'
        . nl2br(htmlspecialchars($submission['message'], ENT_QUOTES, 'UTF-8')) . '</p>';

    if (!empty($submission['details'])) {
        $html .= '<h3>Enquiry Details</h3><table cellpadding="8" cellspacing="0" border="0">';
        foreach ($submission['details'] as $detail) {
            $html .= '<tr><td><strong>' . htmlspecialchars($detail['label'], ENT_QUOTES, 'UTF-8') . '</strong></td><td>'
                . nl2br(htmlspecialchars((string) $detail['value'], ENT_QUOTES, 'UTF-8')) . '</td></tr>';
        }
        $html .= '</table>';
    }

    return $html;
}

function build_email_text(array $submission): string
{
    $details = '';
    foreach ($submission['details'] as $detail) {
        $details .= "{$detail['label']}: {$detail['value']}\n";
    }

    return "New Kai Maison {$submission['formLabel']}\n\n"
        . "Request ID: {$submission['requestId']}\n"
        . "Device ID: {$submission['deviceId']}\n"
        . "Inquiry Type: {$submission['formLabel']}\n"
        . "Name: {$submission['firstName']} {$submission['lastName']}\n"
        . "Email: {$submission['email']}\n"
        . "Phone: " . ($submission['phone'] ?: '-') . "\n"
        . "Submitted At: {$submission['submittedAt']}\n\n"
        . ($details !== '' ? "Enquiry Details:\n{$details}\n" : '')
        . "Message:\n{$submission['message']}\n";
}

function send_resend_email(array $submission, array $config): bool
{
    $apiKey = (string) ($config['resend_api_key'] ?? '');
    $from = (string) ($config['contact_from_email'] ?? '');
    $to = (string) ($config['contact_to_email'] ?? '');

    if ($apiKey === '' || $from === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $payload = [
        'from' => $from,
        'to' => [$to],
        'cc' => [$submission['email']],
        'reply_to' => $submission['email'],
        'subject' => 'Kai Maison ' . $submission['formLabel'] . ': ' . $submission['firstName'] . ' ' . $submission['lastName'],
        'html' => build_email_html($submission),
        'text' => build_email_text($submission),
    ];
    $response = http_post(
        'https://api.resend.com/emails',
        json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
        [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'Idempotency-Key: ' . $submission['requestId'],
        ]
    );

    return $response['status'] >= 200 && $response['status'] < 300;
}

function append_submission_log(string $storageDir, array $entry): void
{
    $path = $storageDir . '/submissions/' . gmdate('Y-m-d') . '.log';
    file_put_contents($path, json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
}

function append_turnstile_log(string $storageDir, array $entry): void
{
    $path = $storageDir . '/turnstile-failures.log';
    file_put_contents($path, json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['ok' => false, 'code' => 'VALIDATION_ERROR'], 405);
}

$config = load_config();
validate_origin($config);
$storageDir = (string) $config['storage_dir'];
ensure_storage($storageDir);

$requestId = bin2hex(random_bytes(8));
$payload = get_payload();
$deviceId = get_device_id($config);
$ip = get_client_ip();

if (clean_string($payload['website'] ?? '', 120) !== '') {
    respond(['ok' => true, 'requestId' => $requestId]);
}

$startedAt = $payload['startedAt'] ?? 0;
if (!is_int($startedAt) && !is_float($startedAt)) {
    validation_error('startedAt');
}

if ((int) floor(microtime(true) * 1000) - (int) $startedAt < 3000) {
    validation_error('startedAt');
}

$firstName = clean_string($payload['firstName'] ?? '', 80);
$lastName = clean_string($payload['lastName'] ?? '', 80);
$phone = clean_string($payload['phone'] ?? '', 40);
$email = clean_string($payload['email'] ?? '', 254);
$message = clean_string($payload['message'] ?? '', 3000);
$formType = clean_string($payload['formType'] ?? 'contact', 40);
$formLabels = form_type_labels();
$turnstileToken = clean_string($payload['turnstileToken'] ?? '', 2048);

if ($firstName === '') validation_error('firstName');
if ($lastName === '') validation_error('lastName');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) validation_error('email');
if (strlen($message) < 2) validation_error('message');
if (!isset($formLabels[$formType])) validation_error('formType');
$details = clean_details($payload['details'] ?? [], $formType);
if ($turnstileToken === '') validation_error('turnstileToken');

$turnstileResult = verify_turnstile($turnstileToken, $config);
if (!$turnstileResult['ok']) {
    append_turnstile_log($storageDir, [
        'requestId' => $requestId,
        'ipHash' => hash_key('ip', $ip, $config),
        'status' => $turnstileResult['status'],
        'errors' => $turnstileResult['errors'],
        'hostname' => $turnstileResult['hostname'],
        'submittedAt' => gmdate('c'),
    ]);
    respond(['ok' => false, 'code' => 'CAPTCHA_FAILED'], 422);
}

$rateKeys = [
    'device' => hash_key('device', $deviceId, $config),
    'email' => hash_key('email', $email, $config),
    'ip' => hash_key('ip', $ip, $config),
];

if (is_rate_limited($storageDir, $rateKeys)) {
    respond(['ok' => false, 'code' => 'RATE_LIMITED'], 429);
}

$submission = [
    'requestId' => $requestId,
    'deviceId' => $deviceId,
    'formType' => $formType,
    'formLabel' => $formLabels[$formType],
    'firstName' => $firstName,
    'lastName' => $lastName,
    'phone' => $phone,
    'email' => $email,
    'message' => $message,
    'details' => $details,
    'submittedAt' => gmdate('c'),
];

$sent = send_resend_email($submission, $config);
append_submission_log($storageDir, [
    'requestId' => $requestId,
    'deviceId' => $deviceId,
    'formType' => $formType,
    'emailHash' => hash_key('email', $email, $config),
    'ipHash' => hash_key('ip', $ip, $config),
    'sent' => $sent,
    'submittedAt' => $submission['submittedAt'],
]);

if (!$sent) {
    respond(['ok' => false, 'code' => 'MAIL_FAILED'], 502);
}

respond(['ok' => true, 'requestId' => $requestId]);
