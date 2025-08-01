import pg from "pg";
import nano from "nano";

import { MilvusClient, DataType } from "@zilliz/milvus2-sdk-node";

// Configuration
const TABLE = "qa.ai";
const PG_HOST = "192.168.100.102";
const PG_USER = "rudix";
const PG_PASSWORD = "maximus";
const PG_DATABASE = "rudix";
const PG_PORT = 5432;
const LIMIT = 1000;

const PG_CONNECTION_STRING = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
const COUCHDB_URL = `http://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:5984`;
const COUCHDB_DB_NAME = "ai";

// Milvus Configuration

const clientx = new MilvusClient({
  address: PG_HOST + ":19530",
  token: "root:Milvus",
});
// wait until connecting finished
await clientx.connectPromise;

const fields = [
  {
    name: "id",
    data_type: DataType.Int64,
    is_primary_key: true,
    auto_id: false,
  },
  {
    name: "embed",
    data_type: DataType.FloatVector,
    dim: 32,
  },
  {
    name: "genid",
    data_type: DataType.VarChar,
    max_length: 512,
  },
];

await clientx.createCollection({
  collection_name: COUCHDB_DB_NAME,
  fields,
});
const pgClient = new pg.Client(PG_CONNECTION_STRING);

await pgClient.connect();

const runMigration = async () => {
  console.log("Starting data migration orchestrator...");

  console.log("Connected to PostgreSQL.");

  const couch = nano(COUCHDB_URL);
  const couchDb = couch.use(COUCHDB_DB_NAME);

  const query = await pgClient.query(
    `select * from ${TABLE} where processed is null order by id asc  limit  ${LIMIT}`,
  );
  try {
    Promise.all(
      query.rows.map((document) =>
        couchDb.insert({ _id: document.genid, ...document }),
      ),
    );
  } catch (e) {}

  const milvus = clientx.insert({
    collection_name: COUCHDB_DB_NAME,
    data: query.rows.map((x) => ({
      genid: x.genid,
      id: x.id,
      embed: JSON.parse(x.embed),
    })),
  });

  const updates = Promise.all(
    query.rows.map((row) =>
      pgClient.query(
        `UPDATE ${TABLE} SET "processed"='1' WHERE "id" = ${row.id}`,
      ),
    ),
  );
  await Promise.all([milvus, updates]);
  console.log(query.rows[0].id);

  runMigration();
};

runMigration();
