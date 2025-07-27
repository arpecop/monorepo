import { cats } from "./cats";
import fs from "fs/promises";
import path from "path";

async function filterCategories() {
  console.log("Starting to filter categories by checking for 404s...");

  const leafCategories = cats.filter(
    (c) => !c.children || c.children.length === 0,
  );

  const validCategories = [];
  const CHUNK_SIZE = 100;

  for (let i = 0; i < leafCategories.length; i += CHUNK_SIZE) {
    const chunk = leafCategories.slice(i, i + CHUNK_SIZE);
    console.log(
      `Processing chunk ${i / CHUNK_SIZE + 1} / ${Math.ceil(
        leafCategories.length / CHUNK_SIZE,
      )}...`,
    );

    const results = await Promise.allSettled(
      chunk.map(async (category) => {
        try {
          const response = await fetch(category.path, { method: "HEAD" });
          if (response.ok) {
            return { status: "fulfilled", value: category };
          } else {
            return {
              status: "rejected",
              reason: `Status ${response.status}`,
              categoryName: category.name,
            };
          }
        } catch (error) {
          return {
            status: "rejected",
            reason: error,
            categoryName: category.name,
          };
        }
      }),
    );

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        validCategories.push(result.value);
      } else if (result.status === "rejected") {
        console.log(
          `Excluding category "${result.categoryName}" due to: ${result.reason}`,
        );
      }
    }
  }

  const outputPath = path.join(process.cwd(), "cats-filtered.ts");
  // Sort categories by ID to maintain a consistent order
  validCategories.sort((a, b) => a.id - b.id);
  const fileContent = `export const cats = ${JSON.stringify(
    validCategories,
    null,
    2,
  )};\n`;

  await fs.writeFile(outputPath, fileContent);

  console.log(`\nFiltering complete.`);
  console.log(`Found ${validCategories.length} valid categories.`);
  console.log(`The filtered list has been written to: ${outputPath}`);
}

filterCategories().catch(console.error);