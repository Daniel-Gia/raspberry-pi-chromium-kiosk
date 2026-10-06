# Raspberry Pi Chromium Kiosk

This project turns a Raspberry Pi into a **Chromium kiosk** that boots straight into a configured URL, and provides a **web-based admin panel** (reachable from other devices on the same network) to **change that kiosk URL remotely**.

**GitHub repository**: [Daniel-Gia/raspberry-pi-chromium-kiosk](https://github.com/Daniel-Gia/raspberry-pi-chromium-kiosk)

## What you get

- **Kiosk browser service** that starts on boot and launches Chromium in kiosk mode.
- **Admin panel** to authenticate and update the kiosk URL.
- **SQLite database**, managed by Prisma, for the kiosk URL and admin account. Create your login in the browser on first use.

## Where to go next

- Read [How to get started](getting-started.md) for Raspberry Pi setup steps.
- If you want to contribute see [First Steps](/contribute/first-steps/).

## License

Licensed under **Apache-2.0**. See `LICENSE` and `NOTICE` in the repository root.
