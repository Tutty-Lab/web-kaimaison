# Hostinger Contact Form Setup

This project ships a PHP contact endpoint for Hostinger at `public/api/contact.php`.
Vite copies it to `dist/api/contact.php` during `npm run build`.

## 1. Public Turnstile Site Key

Edit `public/contact-config.js` before building, or edit `dist/contact-config.js` after building:

```js
window.KAI_CONTACT_CONFIG = window.KAI_CONTACT_CONFIG || {
  turnstileSiteKey: "YOUR_CLOUDFLARE_TURNSTILE_SITE_KEY",
};
```

The site key is public. Do not put the Turnstile secret key here.

## 2. Private Hostinger Config

On Hostinger, create this file outside `public_html`:

```txt
domains/<domain>/private/kai-contact-config.php
```

Use `private/kai-contact-config.example.php` as the template:

```php
<?php

return [
    'resend_api_key' => 'YOUR_RESEND_API_KEY',
    'turnstile_secret_key' => 'YOUR_TURNSTILE_SECRET_KEY',
    'contact_to_email' => 'kaimaisonberlin@gmail.com',
    'contact_from_email' => 'Kai Maison <contact@kaimaison.de>',
    'rate_limit_salt' => 'CHANGE_TO_A_LONG_RANDOM_SECRET',
    'allowed_origins' => [
        'https://kaimaison.de',
        'https://www.kaimaison.de',
    ],
    'storage_dir' => __DIR__ . '/kai-contact',
];
```

Never upload this private config into `public_html`.

The endpoint first looks for `public_html/private/kai-contact-config.php`, then
falls back to `domains/<domain>/private/kai-contact-config.php`. The live
Hostinger setup currently uses the first path because the FTP account is rooted
at the served web directory.

## 3. Deploy To Hostinger

```bash
npm run build
```

Upload the contents of `dist/` into `public_html`.

Confirm these files exist on Hostinger:

```txt
public_html/.htaccess
public_html/contact-config.js
public_html/api/contact.php
```

The endpoint should return JSON for `POST /api/contact.php`. Direct page refreshes like `/about` and `/contact` should keep working through `.htaccess`.

## 4. Behavior

- Owner receives the message at `contact_to_email`.
- Customer email is added as `cc`.
- `reply_to` is set to the customer email.
- Contact, Functions/Catering, and Gift Cards all post to the same endpoint.
- Optional request fields `formType` and `details` label the email subject/body:
  `contact`, `functions`, or `giftCard`.
- The endpoint sets an `HttpOnly`, `SameSite=Lax` device cookie and stores rate-limit counters/logs in the private storage folder.
- Cloudflare Turnstile is verified server-side before email is sent.
