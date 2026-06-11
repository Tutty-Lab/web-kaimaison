from ftplib import FTP, FTP_TLS, all_errors, error_perm
from pathlib import Path, PurePosixPath
import os

local_root = Path("dist").resolve()
if not local_root.exists():
    raise SystemExit("dist/ not found. Run production build first.")

host = os.environ["FTP_HOST"]
port = int(os.environ.get("FTP_PORT", "21"))
user = os.environ["FTP_USER"]
password = os.environ["FTP_PASS"]
remote_root = os.environ.get("FTP_REMOTE_DIR", "/").strip() or "/"
use_tls = os.environ.get("FTP_USE_TLS") == "1"

ftp = FTP_TLS() if use_tls else FTP()
try:
    ftp.connect(host, port, timeout=30)
    ftp.login(user, password)
    if use_tls:
        ftp.prot_p()
    ftp.set_pasv(True)

    def ensure_dir(path):
        pure = PurePosixPath(path)
        parts = [p for p in pure.parts if p != "/"]
        ftp.cwd("/")
        for part in parts:
            try:
                ftp.mkd(part)
            except error_perm:
                pass
            ftp.cwd(part)

    ensure_dir(remote_root)
    for file_path in sorted(local_root.rglob("*")):
        if file_path.is_dir():
            continue
        rel = file_path.relative_to(local_root).as_posix()
        remote_path = PurePosixPath(remote_root) / rel
        ensure_dir(str(remote_path.parent))
        with file_path.open("rb") as fh:
            ftp.storbinary(f"STOR {remote_path.name}", fh)
        print(f"uploaded {rel}")

    ftp.quit()
    print("done")
except all_errors as exc:
    raise SystemExit(f"FTP upload failed: {exc}") from exc
