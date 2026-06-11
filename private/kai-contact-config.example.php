<?php

return [
    // Keep real secrets in Hostinger's private folder, not in public_html or git.
    'resend_api_key' => '',
    'turnstile_secret_key' => '',

    'contact_to_email' => 'kaimaisonberlin@gmail.com',
    'contact_from_email' => 'Kai Maison <contact@kaimaison.de>',
    'rate_limit_salt' => 'CHANGE_TO_A_LONG_RANDOM_SECRET',

    // Optional: restrict browser origins that may submit the form.
    'allowed_origins' => [
        'https://kaimaison.de',
        'https://www.kaimaison.de',
    ],

    // This path should remain outside public_html on Hostinger.
    'storage_dir' => __DIR__ . '/kai-contact',
];
