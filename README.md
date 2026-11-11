# Just Build It Ourselves

A small click-through game about building a spreadsheet engine from scratch. Every card is a real spreadsheet problem.

Static site, served by GitHub Pages at https://spreadsheets.sisona.com

- No server code, no cookies, no analytics, no third-party requests (fonts are self-hosted).
- A strict Content-Security-Policy in `index.html` only allows files from this repo to load.

If this repo is ever deleted or Pages is turned off, remove the `spreadsheets` CNAME record from the sisona.com DNS zone at the same time.
