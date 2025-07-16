import { marked } from "marked";

export const markdown = (text: string) => {
  let content = "";
  let split = text.replace(/^\s+|\s+$/g, "").split("\n");
  split = split.filter((x) => !x.includes("====="));
  split = split.filter((x) => !x.includes("uery:"));
  split = split.filter((x) => !x.includes("alt text"));
  split = split.filter(
    (x) => x.charAt(0) !== "*" && x.charAt(x.length - 1) !== "*",
  );
  split = split.map((x) => {
    if (x.includes("![")) {
      const slug = x
        .split("](")[0]
        .replace(/[^a-zA-Z]/g, "-") // Replace non-alphabet characters with a hyphen
        .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
        .replace(/^-|-$/g, "")
        .toLowerCase();
      return (
        '<div class="target-image relative"><img src="/api/img/q/' +
        slug +
        '.jpg" alt="' +
        slug.replace(/-/g, " ") +
        '"/><div class="image-credit absolute bottom-0 right-0 text-xs text-gray-400 opacity-10 hover:opacity-100 transition-opacity duration-300 p-1"><span>' +
        slug.replace(/-/g, " ") +
        "</span> by gettyimages</div></div>\n"
      );
    }
    return x;
  });
  split.shift();
  content = split.join("\n").replace(/^\s+|\s+$/g, "") as string;

  return marked(content);
};
