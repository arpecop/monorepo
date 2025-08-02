import pg from "pg";
import nano from "nano";

import { QdrantClient } from "@qdrant/js-client-rest";

// Configuration
const PG_HOST = "192.168.100.102";
const PG_USER = "rudix";
const PG_PASSWORD = "maximus";
const PG_DATABASE = "rudix";
const PG_PORT = 5432;
const LIMIT = 500;

const PG_CONNECTION_STRING = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
const COUCHDB_URL = `http://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5984`;

// Milvus Configuration

const client = new QdrantClient({ host: PG_HOST, port: 6333 });
// wait until connecting finished
//

const pgClient = new pg.Client(PG_CONNECTION_STRING);
await pgClient.connect();
const couch = nano(COUCHDB_URL);

const runMigration = async (TABLE, COUCHDB_DB_NAME) => {
  console.log("Starting data migration orchestrator...");

  console.log("Connected to PostgreSQL.");

  const couchDb = couch.use(COUCHDB_DB_NAME);

  const query = await pgClient.query(
    `select * from ${TABLE} where processed is null limit  ${LIMIT}`,
  );
  const rows = query.rows.filter((x) => x.embed && x.embed.length > 0);
  if (query.rows.length > 10) {
    const couchx = Promise.all(
      query.rows.map((document) =>
        couchDb
          .insert({
            _id:
              document.genid.length > 2
                ? document.genid
                : document.id.toString(),
            ...document,
            enbed: JSON.parse(document.embed),
          })
          .catch((e) => null),
      ),
    );

    const vecs = client.upsert(COUCHDB_DB_NAME, {
      wait: true,
      points: rows.map((x) => ({
        id: x.id,
        payload: x,
        vector: JSON.parse(x.embed),
      })),
    });
    const updates = Promise.all(
      query.rows.map((row) =>
        pgClient.query(
          `UPDATE ${TABLE} SET "processed"='1' WHERE "id" = ${row.id}`,
        ),
      ),
    );
    await Promise.all([vecs, updates, couchx]);
    console.log(query.rows[0].id, LIMIT, query.rows.length);
    runMigration(TABLE, COUCHDB_DB_NAME);
  } else {
    console.log("DONE");
    throw new Error();
  }
};
//
runMigration("qa.ai", "ai");
