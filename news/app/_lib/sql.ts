import postgres from "postgres";
import { type NewsPost } from "@/components/newspostitems";

export type NewsItem = NewsPost;
export const db = postgres(process.env.PG_URL as string, {
  // Connection pool settings
  max: 100, // Maximum connections in pool
  idle_timeout: 30, // Close idle connections after 30s
  max_lifetime: 60 * 15, // Connection lifetime in seconds (0 = forever)
  connect_timeout: 10, // Timeout when establishing new connections
  ssl: false,
});
