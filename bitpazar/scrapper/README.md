# Scraper Project

This project is a web scraper built with Bun.js and TypeScript.

## Setup

1.  Install dependencies:
    ```bash
    pnpm install
    ```

## Usage

### Run the scraper

To run the scraper manually, use the following command:

```bash
pnpm scrape
```

This will execute the `scraper.ts` script, which fetches properties from the specified URL and logs them to the console.

### Run the server

The project also includes a simple web server in `server.ts`. To run it:

```bash
pnpm start
```

**Note:** The server is for demonstration purposes and is not used by the cron job.

## Cron Job

To set up a cron job to run the scraper periodically, you can use a command like this:

```bash
# Example: run every day at midnight
0 0 * * * cd /Users/arpecop/Desktop/monorepo/scrapper && pnpm scrape
```
