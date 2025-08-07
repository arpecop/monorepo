import nano from "nano";
import postgres from "postgres";

import { QdrantClient } from "@qdrant/js-client-rest";

// Configuration
const PG_HOST = "192.168.100.102";
const PG_USER = "rudix";
const PG_PASSWORD = "maximus";

const LIMIT = 2500;

const COUCHDB_URL = `http://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5984`;

const sql = postgres("postgres://rudix:maximus@bee.local:5432/rudix");

const client = new QdrantClient({ host: PG_HOST, port: 6333 });

const couch = nano(COUCHDB_URL);
let couchDb = null;

const runMigration = async (table, couchname) => {
  const query = await sql`
  SELECT *
  FROM qa.cats  
  WHERE processed IS NULL
 order by id asc
  LIMIT ${LIMIT}`;
  console.log("qd", couchname);
  if (!couchDb) {
    couchDb = couch.use(couchname);
  }

  const rows = query.filter((x) => x.embed && x.embed.length > 0);
  if (query.length > 10) {
    const couchx = Promise.all(
      rows.map((document) =>
        couchDb
          .insert({
            _id:
              document.genid && document.genid.length > 2
                ? document.genid
                : document.id.toString(),
            ...document,
            enbed: JSON.parse(document.embed),
            type: couchname,
          })
          .catch((e) => null),
      ),
    );

    const vecs = client.upsert(couchname, {
      wait: true,
      points: rows.map((x) => ({
        id: x.id,
        payload: { ...x, type: couchname },
        vector: JSON.parse(x.embed),
      })),
    });

    const x = await sql`UPDATE qa.tags
  SET processed = 1
  WHERE id IN (
    SELECT id
    FROM qa.cats
    WHERE processed IS NULL  order by id asc
    LIMIT ${LIMIT} 
  )`;
    console.log(x);

    await Promise.all([vecs, couchx]);
    console.log(query[0].id, couchname, query.length);
    runMigration(table, couchname);
  } else {
    console.log("DONE");
    throw new Error();
  }
};
//
runMigration(`qa.ai`, "nytimes");
