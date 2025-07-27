import { JSDOM } from "jsdom";

export interface Property {
  url_slug: string | null;
  title: string | null;
  price: number | null;
  currency: string | null;
  city: string | null;
  district: string | null;
  imageUrl: string | null;
  detailsUrl: string | null;
  category: string;
  categoryId: number;
  type: string;
  slug: string;
}

export function parseProperties(
  html: string,
  categoryName: string,
  categoryId: number,
  categoryType: string,
  categorySlug: string,
): Property[] {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const propertyElements = document.querySelectorAll('[data-cy="l-card"]');

  const properties: Property[] = [];

  propertyElements.forEach((element) => {
    const titleElement = element.querySelector("h4");
    const priceElement = element.querySelector('[data-testid="ad-price"]');
    const locationDateElement = element.querySelector(
      '[data-testid="location-date"]',
    );
    const imageElement = element.querySelector("img");
    const linkElement = element.querySelector("a");
    const relativeUrl = linkElement?.getAttribute("href");
    const detailsUrl = relativeUrl ? `https://www.olx.bg${relativeUrl}` : null;

    let url_slug = null;
    if (detailsUrl) {
      url_slug = detailsUrl
        .replace("https://www.olx.bg/d/ad/", "")
        .replace(".html", "");
    }

    let priceText = priceElement?.textContent?.trim();
    let price: number | null = null;
    let currency: string | null = null;

    if (priceText) {
      // Clean up the price text by removing the CSS part
      const cssIndex = priceText.indexOf(".css-");
      if (cssIndex !== -1) {
        priceText = priceText.substring(0, cssIndex);
      }

      // Now parse the cleaned text
      const priceMatch = priceText.match(/([\d\s.,]+)/);
      if (priceMatch) {
        const priceString = priceMatch[0].replace(/\s/g, "").replace(",", ".");
        price = parseFloat(priceString) || null;
      }

      if (priceText.includes("лв")) {
        currency = "лв.";
      }

      if (priceText.toLowerCase().includes("по договаряне")) {
        if (currency) {
          currency += " По договаряне";
        } else {
          currency = "По договаряне";
        }
      }
    }

    const locationDateText = locationDateElement?.textContent?.split(" - ");
    const locationString = locationDateText?.[0]?.trim() || null;
    let city: string | null = null;
    let district: string | null = null;

    if (locationString) {
      const parts = locationString.split(",").map((part) => part.trim());
      if (parts[0]) {
        city = parts[0].replace(/^(гр|с)\.\s*/, "").trim();
      }
      if (parts.length > 1) {
        district = parts.slice(1).join(", ").trim();
      }
    }

    properties.push({
      url_slug,
      title: titleElement?.textContent?.trim() || null,
      price,
      currency,
      city,
      district,
      imageUrl: imageElement?.getAttribute("src") || null,
      detailsUrl: detailsUrl,
      category: categoryName,
      categoryId: categoryId,
      type: categoryType,
      slug: categorySlug,
    });
  });

  return properties;
}

export function parseAdDescription(html: string): string | null {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const descriptionElement = document.querySelector(
      '[data-cy="ad_description"]',
    );
    return descriptionElement?.textContent?.trim() || null;
  } catch (error) {
    console.error("Error parsing ad description:", error);
    return null;
  }
}


export function parseAdImages(html: string): string[] {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const imageElements = document.querySelectorAll(
      'img[loading="lazy"][class*="image-gallery-image"]',
    );
    const imageUrls: string[] = [];
    imageElements.forEach((img) => {
      const src = img.getAttribute("src");
      if (src) {
        imageUrls.push(src);
      }
    });
    return imageUrls;
  } catch (error) {
    console.error("Error parsing ad images:", error);
    return [];
  }
}
