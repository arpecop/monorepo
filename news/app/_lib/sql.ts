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

export const vsearch = async (vectors: string | number[], name: string) => {
  const query = typeof vectors === "string" ? JSON.parse(vectors) : vectors;
  const data = await fetch(
    "http://host.docker.internal:6333/collections/" + name + "/points/query",
    {
      body: JSON.stringify({
        query,
        with_payload: true,
      }),
      cache: "default",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
    },
  );
  const json = (await data.json()) as {
    result: {
      points: [{ payload: { [key: string]: string } }];
    };
  };
  if (json.result) {
    const pref = json.result.points.map((x) => x.payload);
    return pref;
  } else {
    return null;
  }
};
