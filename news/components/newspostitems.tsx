import React from "react";
import { summarize } from "@/app/_lib/timeago";

export type NewsPost = {
  id: number;
  title: string;
  genid: string;
  text: string;
  cat?: string;
  date: string;
};

export default function NewsPostsGrid({ posts }: { posts: NewsPost[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-min">
      {posts.map((post, index) => (
        <NewsPostCard key={post.id} {...post} id={index} />
      ))}
    </div>
  );
}

function NewsPostCard({ title, text, id, genid, cat, date }: NewsPost) {
  const featured = id;

  const size = id % 5 === 0 ? "large" : id % 7 === 0 ? "small" : "medium";
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 row-span-2",
    large: "sm:col-span-2 row-span-2",
  };

  const titleSizes = {
    small: "text-xl",
    medium: "text-2xl",
    large: "text-4xl",
  };
  const content = summarize(text);
  //const lastdig = Number(id.toString().slice(-2));

  const feat = featured === 0 || featured === 5 || featured === 7;

  const img = feat
    ? "/api/img/q/" +
      title
        .replace(/[^a-zA-Z]/g, "-") // Replace non-alphabet characters with a hyphen
        .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
        .replace(/^-|-$/g, "") +
      ".jpg"
    : null;

  return (
    <a
      href={`/post/${genid}`}
      className={`${sizeClasses[size]} group relative`}
    >
      {feat && <SvgComponent featured={feat} />}
      <div
        className={`h-full rounded-lg overflow-hidden transition-transform duration-300 ${feat ? "border-2 border-pink-500" : "border-2 border-gray-200 dark:border-gray-700"} ${size === "large" ? "md:flex" : ""} ${featured === 1 || featured === 6 || featured === 4 ? "lg:rounded-l-none md:rounded-lg" : ""} ${featured === 3 ? "lg:rounded-none md:rounded-lg" : ""} ${featured === 2 || featured === 0 || featured === 5 ? "lg:rounded-r-none md:rounded-lg" : ""}`}
      >
        {img && (
          <div
            className={`relative ${size === "large" ? "md:w-1/2 h-64 sm:h-auto" : "h-48"}`}
          >
            <img
              src={img || "/placeholder.svg"}
              alt={title}
              width={500}
              height={200}
              className="transition-transform duration-300 group-hover:scale-105 w-full h-full object-cover"
            />
          </div>
        )}
        <div className={`p-6 ${size === "large" ? "md:w-1/2" : ""}`}>
          <span className="text-sm font-semibold text-pink-500" id="category">
            {cat}
          </span>
          <h2 className={`mt-2 ${titleSizes[size]} font-bold font-playfair`}>
            {title.replace(/[^a-zA-Z0-9.]/g, " ")}
          </h2>
          <div className="text-xs font-thin pt-2">
            {date.split("T")[0]}
            <div id="by"></div>
          </div>

          <p className="mt-3">{content}.</p>
        </div>
      </div>
    </a>
  );
}

const SvgComponent = ({ featured }: { featured: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={60}
    className="absolute z-10"
  >
    <g fill="none" fillRule="evenodd">
      <path
        className="fill-white"
        d="M0 0h60L46.035 4.116c-4.026 1.989-6.942 3.63-8.748 4.924-1.807 1.294-4.236 3.172-7.287 5.636L16.324 30 6.366 43.056 1.937 53.28V60l-12.39 2.351L-5.483 0H0Z"
      />
      <path
        className={
          featured ? "stroke-pink-500" : "dark:stroke-gray-800 stroke-gray-200"
        }
        strokeWidth={"0.12rem"}
        d="M60 1c16.292 0 31.042 6.604 41.72 17.28C112.395 28.959 119 43.709 119 60c0 16.292-6.604 31.042-17.28 41.72C91.041 112.395 76.291 119 60 119c-16.292 0-31.042-6.604-41.72-17.28C7.605 91.041 1 76.291 1 60c0-11.928 6.813-21.16 14.479-29.523l.71-.769a290.468 290.468 0 0 1 3.226-3.41l.718-.748.716-.745c.72-.75 1.437-1.495 2.145-2.239l.394-.413 1.064-1.116.707-.74C35.034 9.97 44.343 1 60 1Z"
      />
    </g>
  </svg>
);
