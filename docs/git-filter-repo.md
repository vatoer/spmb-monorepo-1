```sh
python -m git_filter_repo `
  --name-callback "return b'developer' if name == b'developer' else name" `
  --email-callback "return b'developer@starganteknologi.com' if email == b'developer@example.com' else email" `
  --force

```