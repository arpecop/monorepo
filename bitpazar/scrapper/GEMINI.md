# Gemini Project Setup

This document provides instructions for setting up and running the scraper project.

## Prerequisites

- Node.js and pnpm
- PostgreSQL database

## Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root of the project with the following content:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    ```
    Replace `user`, `password`, `host`, `port`, and `database` with your PostgreSQL connection details.

3.  **Database Schema:**
    Connect to your PostgreSQL database and run the following SQL commands to create the necessary schema and table:

    ```sql
    CREATE SCHEMA IF NOT EXISTS products;

    CREATE TABLE IF NOT EXISTS products.products (
        url_slug TEXT PRIMARY KEY,
        title TEXT,
        price NUMERIC,
        currency TEXT,
        city TEXT,
        district TEXT,
        date DATE,
        image_url TEXT,
        details_url TEXT,
        category TEXT,
        category_id INTEGER,
        type TEXT,
        slug TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS products_created_at_idx ON products.products (created_at DESC);
    ```

## Running the Scraper

To run the scraper, use the following command:

```bash
pnpm start
```

The script will scrape data from the specified categories, insert it into the database, and skip any categories that have been processed in the last hour.
