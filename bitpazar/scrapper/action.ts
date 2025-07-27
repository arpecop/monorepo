import "dotenv/config";
import postgres from "postgres";
import { z } from "zod";
import { parseProperties, Property } from "./parser";
import { cats } from "./cats";

type Category = (typeof cats)[number];

const productSchema = z.object({
  url_slug: z.string(),
  title: z.string().nullable(),
  price: z.number().optional().nullable(),
  currency: z.string().optional().nullable(),
  city: z.string().nullable(),
  district: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  details_url: z.string().nullable(),
  category: z.string(),
  category_id: z.number(),
  type: z.string(),
  slug: z.string(),
});

type Product = z.infer<typeof productSchema>;

const HOUR_IN_MS = 60 * 60 * 1000;
const LEGIT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

async function syncAndGetScrapeList(
  sql: postgres.Sql,
  allCategories: Category[],
): Promise<Category[]> {
  console.log("Syncing categories with cronlogic table...");

  const categoryInserts = allCategories.map((c) => ({
    category_id: c.id,
    category_name: c.name,
  }));

  // Ensure all categories from cats.ts exist in the cron table
  await sql`
    INSERT INTO products.cronlogic ${sql(categoryInserts)}
    ON CONFLICT (category_id) DO NOTHING
  `;

  const oneHourAgo = new Date(Date.now() - HOUR_IN_MS);

  // Get categories that haven't been scraped in the last hour
  const categoriesToScrapeIds = await sql`
    SELECT category_id FROM products.cronlogic
    WHERE last_scraped_at IS NULL OR last_scraped_at < ${oneHourAgo}
  `;

  const idSet = new Set(categoriesToScrapeIds.map((row) => row.category_id));

  return allCategories.filter((c) => idSet.has(c.id));
}

async function processCategory(category: Category, sql: postgres.Sql) {
  console.log(`Processing category: ${category.name}`);
  const url = category.path;
  let productsFound = false;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": LEGIT_USER_AGENT,
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch category ${category.name}: ${response.statusText}`,
      );
      return; // Don't update timestamp if fetch fails
    }

    const content = await response.text();
    const parsedProducts: Property[] = parseProperties(
      content,
      category.name,
      category.id,
      category.type,
      category.label,
    );

    const relevantProducts = parsedProducts.filter(
      (p) => p.categoryId === category.id,
    );

    if (relevantProducts.length > 0) {
      productsFound = true;
      const products: Product[] = relevantProducts.map((p) => ({
        url_slug: p.url_slug,
        title: p.title,
        price: p.price,
        currency: p.currency,
        city: p.city,
        district: p.district,
        image_url: p.imageUrl,
        details_url: p.detailsUrl,
        category: p.category,
        category_id: p.categoryId,
        type: p.type,
        slug: p.slug,
      }));

      const validatedProducts = products
        .map((p) => {
          const validation = productSchema.safeParse(p);
          if (!validation.success) {
            return null;
          }
          return validation.data;
        })
        .filter((p): p is Product => p !== null);

      if (validatedProducts.length > 0) {
        await sql`
          INSERT INTO products.products ${sql(validatedProducts)}
          ON CONFLICT (url_slug) DO UPDATE
            SET created_at = now()
        `;
      }
    }
  } catch (error) {
    console.error(
      `An error occurred while processing category ${category.name}:`,
      error,
    );
    // Do not update timestamp if there's an error during processing
    return;
  } finally {
    // ALWAYS update the timestamp to prevent re-scraping, even if no products were found.
    // This marks the category as "checked".
    console.log(
      `Finished processing ${category.name}. Found products: ${productsFound}`,
    );
    await sql`
      UPDATE products.cronlogic
      SET last_scraped_at = now()
      WHERE category_id = ${category.id}
    `;
  }
}

async function main(sql: postgres.Sql) {
  console.log("--- Starting Scraping Process ---");

  const leafCategories = cats.filter(
    (c) => !c.children || c.children.length === 0,
  );

  const categoriesToProcess = await syncAndGetScrapeList(sql, leafCategories);

  if (categoriesToProcess.length === 0) {
    console.log("No categories due for scraping. Exiting.");
    return;
  }

  console.log(`Found ${categoriesToProcess.length} categories to process.`);

  const categoryChunkSize = 50;

  for (let i = 0; i < categoriesToProcess.length; i += categoryChunkSize) {
    const chunk = categoriesToProcess.slice(i, i + categoryChunkSize);
    await Promise.all(chunk.map((cat) => processCategory(cat, sql)));
    console.log(
      `--- Finished category batch ${
        i / categoryChunkSize + 1
      } / ${Math.ceil(categoriesToProcess.length / categoryChunkSize)} ---`,
    );
  }

  console.log("--- Scraping Process Finished ---");
}

export async function run() {
  const databaseUrl = "postgres://rudix:maximus@130.204.65.82:5432/rudix";

  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be provided in .env file");
  }

  const sql = postgres(databaseUrl);

  try {
    await main(sql);
  } finally {
    await sql.end();
  }
}

run().catch(console.error);
