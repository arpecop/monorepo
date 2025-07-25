import { parseProperties } from "./parser";
import postgres from "postgres";
import { config } from "dotenv";
import { cats } from "./cats";

// Load environment variables from .env file
config();

const { DATABASE_URL, PORT } = process.env;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set.");
  process.exit(1);
}

// Set up the database connection
const sql = postgres(DATABASE_URL);

console.log("Successfully connected to PostgreSQL!");

async function fetchProperties() {
  // DEV: Loop through the first item from cats.json
  const firstCategory = cats[0];
  const html = await fetch(firstCategory.path).then((response) =>
    response.text(),
  );

  const properties = parseProperties(
    html,
    firstCategory.name,
    firstCategory.id,
    firstCategory.type,
    firstCategory.slug,
  );
  console.log("Parsed properties:", properties);

  // Here you would parse the properties and insert them into the database
  // For example:
  // for (const prop of properties) {
  //   await sql`INSERT INTO properties (id, title, price, location, date, image_url, details_url, category, category_id) VALUES (${prop.id}, ${prop.title}, ${prop.price}, ${prop.location}, ${prop.date}, ${prop.imageUrl}, ${prop.detailsUrl}, ${prop.category}, ${prop.categoryId})`;
  // }

  return properties;
}

// The server part can be moved to its own file as the project grows
function startServer() {
  const port = PORT || 3000;
  Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === "/scrape") {
        console.log("Scraping request received!");
        await fetchProperties();
        return new Response("Scraping finished.", { status: 200 });
      }
      return new Response(
        "Hello World! Visit /scrape to trigger the scraper.",
        { status: 200 },
      );
    },
  });

  console.log(`Server running at http://localhost:${port}/`);
}

// Check if the script is being run directly
if (import.meta.main) {
  startServer();
}
