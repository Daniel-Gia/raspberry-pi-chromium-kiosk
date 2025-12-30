# Admin Panel

## Build & push (ARM64 / Raspberry Pi)

From inside this `admin-panel/` directory, build and push the image:

```sh
docker buildx build --platform linux/arm64 -t ${REPO}:latest -f Dockerfile . --push
```
> **Note:** Replace `{repo}` with your Docker Hub repository name (e.g., `username/image-name`).  

Example:
```sh
docker buildx build --platform linux/arm64 -t ghcr.io/daniel-gia/raspberry-pi-chromium-kiosk-admin-panel:latest -f Dockerfile . --push
```
