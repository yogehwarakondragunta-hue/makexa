/**
 * ONE-TIME MIGRATION SCRIPT
 * Copies all data from local MongoDB (127.0.0.1:27017/makexa)
 * into the Atlas database. Does NOT change the app's connection.
 * 
 * Run: node migrate_local_to_atlas.js
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017';
const LOCAL_DB = 'makexa';
const ATLAS_URI = process.env.MONGO_URI;

async function migrate() {
    console.log('🔄 Starting migration from local → Atlas...\n');

    const localClient = new MongoClient(LOCAL_URI);
    const atlasClient = new MongoClient(ATLAS_URI);

    try {
        await localClient.connect();
        console.log('✅ Connected to LOCAL MongoDB');

        await atlasClient.connect();
        console.log('✅ Connected to ATLAS MongoDB\n');

        const localDb = localClient.db(LOCAL_DB);
        const atlasDb = atlasClient.db(); // uses default db from connection string

        // Get all collections from local
        const collections = await localDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections to migrate:\n`);

        for (const colInfo of collections) {
            const colName = colInfo.name;
            const localDocs = await localDb.collection(colName).find().toArray();

            if (localDocs.length === 0) {
                console.log(`  ⏭️  ${colName}: 0 documents (skipped)`);
                continue;
            }

            const atlasCol = atlasDb.collection(colName);

            // Insert documents one by one, skip duplicates (by _id)
            let inserted = 0;
            let skipped = 0;

            for (const doc of localDocs) {
                try {
                    await atlasCol.insertOne(doc);
                    inserted++;
                } catch (err) {
                    if (err.code === 11000) {
                        // Duplicate key — already exists in Atlas
                        skipped++;
                    } else {
                        console.error(`    ❌ Error inserting into ${colName}:`, err.message);
                    }
                }
            }

            console.log(`  ✅ ${colName}: ${inserted} inserted, ${skipped} skipped (already exist)`);
        }

        console.log('\n🎉 Migration complete! Your Atlas database now has all the local data.');
        console.log('   The app connection is unchanged — still pointing to Atlas.');

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await localClient.close();
        await atlasClient.close();
    }
}

migrate();
