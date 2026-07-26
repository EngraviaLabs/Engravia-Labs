const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

async function main() {
  const dbPath = path.join(__dirname, '..', '.tools', 'db');
  if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });

  console.log('🚀 Starting local MongoDB instance on port 27017...');
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'engravia_labs',
      dbPath: dbPath,
      storageEngine: 'wiredTiger',
    },
  });

  console.log('✅ Local MongoDB running on mongodb://127.0.0.1:27017/engravia_labs');
}

main().catch(err => {
  console.error('❌ Failed to start local MongoDB:', err);
  process.exit(1);
});
