export function timeAgo(inputDate: string | Date): string {
  let date: Date;

  // Check if the input is already a Date object
  if (inputDate instanceof Date) {
    date = inputDate;
  } else if (typeof inputDate === "string") {
    // If it's a string, try to parse it
    date = new Date(inputDate);
  } else {
    // Handle other unexpected types
    // In a real application, you might throw an error or handle this more gracefully.
    // For this function, we'll return "Invalid date" and log an error.
    console.error(
      "Invalid input type provided. Expected string or Date object.",
    );
    return "Invalid date";
  }

  // Validate if the parsed date is valid
  if (isNaN(date.getTime())) {
    // In a real application, you might throw an error or handle this more gracefully.
    // For this function, we'll return "Invalid date" and log an error.
    console.error("Invalid date value after parsing:", inputDate);
    return "Invalid date";
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const unit in intervals) {
    const intervalValue = intervals[unit];
    const count = Math.floor(seconds / intervalValue);

    if (count >= 1) {
      return `${count} ${unit}${count === 1 ? "" : "s"} ago`;
    }
  }

  return "just now";
}

export function readtime(text: string): number {
  if (typeof text !== "string") {
    console.error(
      "Invalid input type provided for estimateReadTime. Expected string.",
    );
    return 0; // Return 0 for invalid input
  }

  // Split the text by whitespace to count words
  // Use a regular expression to handle multiple spaces, newlines, etc.
  const words = text.trim().split(/\s+/);

  // Filter out any empty strings that might result from split (e.g., if there are multiple spaces)
  const wordCount = words.filter((word) => word.length > 0).length;

  // Average reading speed (words per minute)
  const wordsPerMinute = 200;

  // Calculate reading time
  const readingTimeMinutes = wordCount / wordsPerMinute;

  // Round to the nearest whole minute
  return Math.ceil(readingTimeMinutes);
}

export function summarize(text: string): string {
  return text
    .split("\n")
    .filter((x) => !x.includes("!["))
    .slice(1, 5)
    .join(" ")
    .replace(/[^a-zA-Z0-9.]/g, " ")
    .split(".")
    .slice(0, 2)
    .join(". ");
}

export const weightFrequencySort = (arr: string[]): string[] => {
  const weights = new Map<string, number>();

  arr.forEach((item) => {
    weights.set(item, (weights.get(item) || 0) + 1);
  });
  arr.sort((a, b) => {
    const weightA = weights.get(a) || 0;
    const weightB = weights.get(b) || 0;
    return weightB - weightA;
  });

  return arr;
};

export const dominant = (arr: string[]) =>
  arr.reduce((acc, val, _i, a) => {
    const count = a.filter((x) => x === val).length;
    const accCount = a.filter((x) => x === acc).length;
    return count > accCount ||
      (count === accCount && a.indexOf(val) < a.indexOf(acc))
      ? val
      : acc;
  }, arr[0]);
