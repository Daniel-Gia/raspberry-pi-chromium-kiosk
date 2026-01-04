# Admin Panel

## How is it made

Currently the admin panel is made using Nextjs so if you are not familiar with Nextjs we recommend understanding it first.

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
