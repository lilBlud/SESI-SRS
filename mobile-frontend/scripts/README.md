# Migration & Utility Scripts

This folder contains administrative and one-off utility scripts used during project setup and database synchronization:

- `update_db.js`: Syncs/updates corporate glossary term definitions with the running backend.
- `copy_assets.js`: Helper script for copying generated design assets and logos into `public/assets`.
- `copy_img.js`: Image copier utility.
- `copy_logo.js`: Logo copier utility.
- `rearrange.cjs`: Historical refactoring script that modularized the frontend into `components/pages`, `components/tabs`, and `components/ui`.
- `refactor.cjs`: Component extraction script for splitting monolithic app views.
- `fix.cjs`: Automated import and syntax fixer script.
