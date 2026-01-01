# Raspberry Pi Chromium Kiosk

This project turns a Raspberry Pi into a **Chromium kiosk** that boots straight into a configured URL, and provides a **web-based admin panel** (reachable from other devices on the same network) to **change that kiosk URL remotely**.

**GitHub repository**: [Daniel-Gia/raspberry-pi-chromium-kiosk](https://github.com/Daniel-Gia/raspberry-pi-chromium-kiosk)

## What you get

- **Kiosk browser service** that starts on boot and launches Chromium in kiosk mode.
- **Admin panel** to authenticate and update the kiosk URL.
- **Simple settings file** (`settings/default_url.txt`) that both the kiosk and the admin panel rely on.

## Where to go next

- Read [How to get started](getting-started.md) for Raspberry Pi setup steps.
- See [Project structure](project-structure.md) for a guided walkthrough of the repository layout.

## License

Licensed under **Apache-2.0**. See `LICENSE` and `NOTICE` in the repository root.