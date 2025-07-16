import postgres from "postgres";
const sql = postgres("postgres://rudix:maximus@bee.local:5432/rudix");
import pkg from "lodash";

const { shuffle } = pkg;

function reduceArray(arr) {
  const every12th = arr.filter((_, i) => (i + 1) % 12 === 0);
  return every12th.map((d) => Number(d.toFixed(7)));
}
async function genemb(arr) {
  const response = await fetch("http://127.0.0.1:11434/api/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: shuffle(["snow1", "snow2", "snow3", "snow4", "snow5"])[0],
      input: arr,
      options: {
        num_thread: 1,
        // "num_batch":5000,
        // "num_gpu": 999,
        // "main_gpu": 0,
      },
    }),
  });
  const data = await response.json();

  const x = data.embeddings.map((d) => JSON.stringify(reduceArray(d)));
  console.log("done");

  return x;
}

//dsdd
async function go() {
  const items =
    await sql`SELECT "genid", "embed" FROM qa.ai WHERE "qdrant" IS NULL  LIMIT 25;`;

  const arr = items.map(
    (d) =>
      d.title.substr(0, 250) + " " + d.cat.replaceAll("'", "").substr(0, 250),
  );
  const emb = await genemb(arr);

  if (!emb.error) {
    const updates = items.map(
      (x, i) =>
        sql`UPDATE qa.tags SET "embed" = ${emb[i]}, "p" = 'o'  WHERE "id" = ${x.id};`,
    );
    await Promise.all(updates);
  } else {
    const updates = items.map(
      (x) => sql`UPDATE qa.tags SET  "p" = 'e'  WHERE "id" = ${x.id};`,
    );
    await Promise.all(updates);
  }
  if (items.length > 10) {
    go();
  }
}
go();
