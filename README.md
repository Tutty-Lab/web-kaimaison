# Kai Maison

Website Kai Maison build bằng Vite + React, deploy lên Hostinger. Form liên hệ dùng endpoint PHP tại `public/api/contact.php`; secret Resend/Turnstile nằm trong file config private ngoài public web root.

## 1. Clone repo

Windows PowerShell hoặc macOS Terminal:

```bash
git clone https://github.com/Daeyang-Sea/kaimaison.git
cd kaimaison
```

## 2. Chạy local

Cài dependency:

```bash
npm install
```

Chạy dev server:

```bash
npm run dev
```

Mở URL Vite in ra terminal, thường là `http://127.0.0.1:5173/` hoặc `http://127.0.0.1:5174/`.

## 3. Build production

Cách chính:

```bash
npm run build
```

Sau khi build xong sẽ có folder `dist/`. Script build tự chạy optimize assets và tạo thêm route tĩnh như `/contact`, `/events`, `/impressum`, `404.html` để refresh trang trên Hostinger không bị lỗi.

Nếu máy Windows nào đó vẫn báo lỗi kiểu `The system cannot find the path specified`, dùng fallback:

```powershell
npm run optimize:assets
node node_modules\vite\bin\vite.js build
npm run prepare:pages
```

## 4. Upload lên Hostinger từ Windows

Chạy từ thư mục gốc project. Không ghi password thật vào git.

```powershell
$env:FTP_HOST="92.113.18.6"
$env:FTP_PORT="21"
$env:FTP_USER="u186007800.codexupload"
$env:FTP_PASS="YOUR_FTP_PASSWORD"
$env:FTP_REMOTE_DIR="/"
python scripts\hostinger-upload.py
```

Nếu Hostinger bắt dùng FTPS:

```powershell
$env:FTP_USE_TLS="1"
python scripts\hostinger-upload.py
```

## 5. Upload lên Hostinger từ macOS

Chạy từ thư mục gốc project. macOS thường có `python3`, nên dùng `python3` thay vì `python`.

```bash
export FTP_HOST="92.113.18.6"
export FTP_PORT="21"
export FTP_USER="u186007800.codexupload"
export FTP_PASS="YOUR_FTP_PASSWORD"
export FTP_REMOTE_DIR="/"
python3 scripts/hostinger-upload.py
```

Nếu Hostinger bắt dùng FTPS:

```bash
export FTP_USE_TLS="1"
python3 scripts/hostinger-upload.py
```

Script upload toàn bộ nội dung trong `dist/` lên FTP root đang serve `kaimaison.de`. Script không upload folder `private/`.

## 6. Kiểm tra sau khi upload

Windows PowerShell:

```powershell
curl.exe -I -L https://kaimaison.de/
curl.exe -s -L "https://kaimaison.de/?v=$(Get-Date -Format yyyyMMddHHmmss)" | Select-String -Pattern "GTM-MJS9V7RD|assets/"
curl.exe -s -X POST https://kaimaison.de/api/contact.php -H "Content-Type: application/json" --data "{}"
```

macOS Terminal:

```bash
curl -I -L https://kaimaison.de/
curl -s -L "https://kaimaison.de/?v=$(date +%Y%m%d%H%M%S)" | grep -E "GTM-MJS9V7RD|assets/"
curl -s -X POST https://kaimaison.de/api/contact.php -H "Content-Type: application/json" --data "{}"
```

Kết quả đúng của contact API là JSON lỗi validate, ví dụ `VALIDATION_ERROR`. Nếu thấy PHP source, HTML, hoặc 404 thì sai path/API trên Hostinger.

Nếu live site vẫn hiện nội dung cũ: vào Hostinger Cache Manager clear cache, sau đó hard refresh browser.

## 7. Config contact form trên Hostinger

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

## 8. File có thể xóa khi dọn dẹp

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