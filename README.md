# Kai Maison

Website Kai Maison build bằng Vite + React, deploy lên Hostinger. Form liên hệ dùng endpoint PHP tại `public/api/contact.php`; secret Resend/Turnstile nằm trong file config private ngoài public web root.

## 1. Chạy local

Cài dependency:

```powershell
npm install
```

Chạy dev server:

```powershell
npm run dev
```

Mở URL Vite in ra terminal, thường là `http://127.0.0.1:5173/` hoặc `http://127.0.0.1:5174/`.

## 2. Build production

Cách bình thường:

```powershell
npm run build
```

Nếu Windows báo lỗi kiểu `The system cannot find the path specified`, dùng cách fallback này:

```powershell
npm run optimize:assets
node node_modules\vite\bin\vite.js build
npm run prepare:pages
```

Sau khi build xong sẽ có folder `dist/`. Script `prepare:pages` tạo thêm route tĩnh như `/contact`, `/events`, `/impressum` và `404.html` để refresh trang trên Hostinger không bị lỗi.

## 3. Upload lên Hostinger bằng terminal

Chạy từ thư mục gốc project `D:\kaimaison`. Không ghi password thật vào git.

```powershell
$env:FTP_HOST="92.113.18.6"
$env:FTP_PORT="21"
$env:FTP_USER="u186007800.codexupload"
$env:FTP_PASS="YOUR_FTP_PASSWORD"
$env:FTP_REMOTE_DIR="/"
python scripts\hostinger-upload.py
```

Script này upload toàn bộ nội dung trong `dist/` lên FTP root đang serve `kaimaison.de`. Script không upload folder `private/`.

Nếu Hostinger bắt dùng FTPS:

```powershell
$env:FTP_USE_TLS="1"
python scripts\hostinger-upload.py
```

## 4. Kiểm tra sau khi upload

Kiểm tra site trả về OK:

```powershell
curl.exe -I -L https://kaimaison.de/
```

Kiểm tra HTML mới có asset/GTM:

```powershell
curl.exe -s -L "https://kaimaison.de/?v=$(Get-Date -Format yyyyMMddHHmmss)" | Select-String -Pattern "GTM-MJS9V7RD|assets/"
```

Kiểm tra contact API có chạy PHP:

```powershell
curl.exe -s -X POST https://kaimaison.de/api/contact.php -H "Content-Type: application/json" --data "{}"
```

Kết quả đúng là JSON lỗi validate, ví dụ `VALIDATION_ERROR`. Nếu thấy PHP source, HTML, hoặc 404 thì sai path/API trên Hostinger.

Nếu live site vẫn hiện nội dung cũ: vào Hostinger Cache Manager clear cache, sau đó hard refresh browser.

## 5. Config contact form trên Hostinger

Không upload `private/kai-contact-config.php` lên public root. File config thật phải nằm ngoài public web root trên Hostinger.

Ví dụ nội dung config:

```php
<?php
return [
    'resend_api_key' => 're_...',
    'resend_from' => 'Kai Maison <contact@kaimaison.de>',
    'mail_to' => 'kaimaisonberlin@gmail.com',
    'turnstile_secret_key' => '0x...',
];
```

Chi tiết setup contact backend nằm ở `docs/hostinger-contact.md`.

## 6. File có thể xóa khi dọn dẹp

Các file/folder generated hoặc log có thể xóa an toàn:

```text
dist/
output/
*.log
private/kai-contact/
__pycache__/
*.pyc
```

Các folder/file nên giữ:

```text
assets/
public/
src/
scripts/
private/kai-contact-config.php
private/kai-contact-config.example.php
```
