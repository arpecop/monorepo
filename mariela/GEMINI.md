## Onboarding Notes

- This project exclusively uses image sequences for animations. All video-related functionality has been removed.
- The application is configured to use image sequences with the `spag_` prefix, padded to four digits (e.g., `spag_0001.jpg`).
- The image sequences are located in the `/public/ezgif-split/` directory.
- Text slides now have their own dedicated sticky sections. Each text slide occupies 100vh of scroll height and animates in from the right when its section enters the viewport.