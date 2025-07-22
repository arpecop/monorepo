import pg from 'pg';
import { QdrantClient } from '@qdrant/qdrant-client';

// --- PostgreSQL Configuration ---
const DB_CONFIG = {
    user: 'rudix',
    host: '192.168.100.102',
    database: 'rudix',
    password: 'maximus',
    port: 5432,
};

// --- Qdrant Configuration ---
const QDRANT_CONFIG = {
    host: '192.168.100.102',
    port: 6333, // Default gRPC port
    apiKey: null, // Set if your Qdrant instance requires an API key
};
const COLLECTION_NAME = "your_vector_collection";
const VECTOR_DIMENSION = 32; // As specified in your request

/**
 * Initializes and returns a PostgreSQL client.
 * @returns {pg.Client} A connected PostgreSQL client.
 */
async function getPgClient() {
    const client = new pg.Client(DB_CONFIG);
    try {
        await client.connect();
        console.log("Connected to PostgreSQL.");
        return client;
    } catch (error) {
        console.error("Error connecting to PostgreSQL:", error);
        return null;
    }
}

/**
 * Initializes and returns a Qdrant client, ensuring the collection exists.
 * @returns {QdrantClient} A connected Qdrant client.
 */
async function getQdrantClient() {
    const client = new QdrantClient(QDRANT_CONFIG);
    try {
        // Ensure the collection exists or create it
        await client.recreateCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_DIMENSION,
                distance: 'Cosine', // Or 'Euclid', 'Dot' based on your vector type
            },
        });
        console.log(`Qdrant collection '${COLLECTION_NAME}' ensured.`);
        return client;
    } catch (error) {
        console.error("Error initializing Qdrant client or collection:", error);
        return null;
    }
}

/**
 * Migrates data from PostgreSQL to Qdrant in batches.
 * This function will repeatedly call the PostgreSQL function
 * to get unprocessed data until no more records are found.
 * @param {number} batchSize - The number of records to process in each batch.
 */
async function migrateDataToQdrant(batchSize = 100) {
    const pgClient = await getPgClient();
    if (!pgClient) return;

    const qdrantClient = await getQdrantClient();
    if (!qdrantClient) {
        await pgClient.end();
        return;
    }

    let totalMigrated = 0;
    let hasMoreRecords = true;

    while (hasMoreRecords) {
        let recordsToProcess = [];
        try {
            // Start a transaction for the PostgreSQL operations
            await pgClient.query('BEGIN');

            // Call the PostgreSQL function to get a batch and mark them
            const res = await pgClient.query(
                `SELECT record_id, record_data_payload, record_embed FROM get_and_mark_unprocessed_batch($1);`,
                [batchSize]
            );
            recordsToProcess = res.rows;

            if (recordsToProcess.length === 0) {
                console.log("No more unprocessed records found. Migration complete.");
                hasMoreRecords = false; // Exit loop
                await pgClient.query('COMMIT'); // Commit the empty transaction
                break;
            }

            const points = [];
            for (const record of recordsToProcess) {
                const { record_id, record_data_payload, record_embed } = record;

                // Convert string array to float array
                let vector;
                try {
                    // Ensure each element is a string and convert to float
                    vector = record_embed.map(val => parseFloat(val));
                    if (vector.some(isNaN)) {
                        throw new Error("Contains non-numeric values after parsing.");
                    }
                    if (vector.length !== VECTOR_DIMENSION) {
                        console.warn(`Warning: Record ID ${record_id} has vector length ${vector.length}, expected ${VECTOR_DIMENSION}. Skipping.`);
                        continue;
                    }
                } catch (e) {
                    console.error(`Error parsing vector for record ID ${record_id}: ${e.message}. Skipping.`);
                    continue;
                }

                // Prepare payload for Qdrant (optional, include other data)
                const payload = {
                    pg_id: record_id,
                    data_payload: record_data_payload
                };

                points.push({
                    id: record_id, // Use PostgreSQL ID as Qdrant point ID
                    vector: vector,
                    payload: payload
                });
            }

            if (points.length > 0) {
                // Upload points to Qdrant
                await qdrantClient.upsert(COLLECTION_NAME, {
                    wait: true, // Wait for the operation to complete
                    points: points,
                });
                console.log(`Successfully migrated ${points.length} records to Qdrant.`);
                totalMigrated += points.length;
            }

            // Commit the transaction in PostgreSQL after successful Qdrant upsert
            await pgClient.query('COMMIT');
            console.log(`Total records migrated so far: ${totalMigrated}`);

        } catch (error) {
            console.error("Error during migration batch:", error);
            // Rollback the PostgreSQL transaction in case of any error
            await pgClient.query('ROLLBACK');
            hasMoreRecords = false; // Stop migration on error
        }

        // Small delay to avoid hammering the database/Qdrant
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await pgClient.end();
    console.log(`Migration finished. Total records migrated: ${totalMigrated}`);
}

// Run the migration script
migrateDataToQdrant(50); // You can adjust the batch size here
