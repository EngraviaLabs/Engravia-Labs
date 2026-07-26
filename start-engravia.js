const { MongoMemoryServer } = require('./backend/node_modules/mongodb-memory-server');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const NODE_BIN_DIR = path.join(__dirname, '.tools', 'node-v20.14.0-win-x64');
process.env.PATH = `${NODE_BIN_DIR};${process.env.PATH}`;

async function run() {
  console.log('\x1b[36m%s\x1b[0m', '================================================');
  console.log('\x1b[33m%s\x1b[0m', '   ENGRAVIA LABS — LOCAL DEV ENVIRONMENT SERVER ');
  console.log('\x1b[36m%s\x1b[0m', '================================================\n');

  // 1. Start MongoDB
  const dbPath = path.join(__dirname, '.tools', 'db');
  if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true });

  console.log('📦 [1/4] Starting local MongoDB database on port 27017...');
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'engravia_labs',
      dbPath: dbPath,
      storageEngine: 'wiredTiger',
    },
  });
  console.log('✅ Local MongoDB is running on mongodb://127.0.0.1:27017/engravia_labs\n');

  // 2. Seed database
  console.log('🌱 [2/4] Populating database with sample products & credentials...');
  try {
    execSync(`node "${path.join(__dirname, 'database', 'seed.js')}"`, {
      cwd: path.join(__dirname, 'database'),
      stdio: 'inherit',
      env: process.env,
    });
  } catch (e) {
    console.error('Seeding status:', e.message);
  }

  console.log('\n🚀 [3/4] Launching Backend, Admin, and Storefront services...\n');

  // Helper to spawn sub-processes
  const runService = (name, cwd, command, args) => {
    const proc = spawn(command, args, {
      cwd,
      shell: true,
      stdio: 'pipe',
      env: process.env,
    });

    proc.stdout.on('data', data => {
      const line = data.toString().trim();
      if (line) console.log(`[${name}] ${line}`);
    });

    proc.stderr.on('data', data => {
      const line = data.toString().trim();
      if (line) console.error(`[${name}] ${line}`);
    });

    return proc;
  };

  // Start Backend, Admin, and Frontend
  runService('Backend API', path.join(__dirname, 'backend'), 'npm', ['run', 'dev']);
  runService('Admin Panel', path.join(__dirname, 'admin'), 'npm', ['run', 'dev']);
  runService('Customer Store', path.join(__dirname, 'frontend'), 'npm', ['run', 'dev']);

  console.log('================================================');
  console.log('🎉 ALL SERVICES ARE RUNNING!');
  console.log('================================================');
  console.log('🛍 Customer Storefront: \x1b[32mhttp://localhost:3000\x1b[0m');
  console.log('🔧 Admin Panel:          \x1b[32mhttp://localhost:3001\x1b[0m');
  console.log('⚙️ Backend API:           \x1b[32mhttp://localhost:5000\x1b[0m');
  console.log('\n🔐 Admin Login Credentials:');
  console.log('   Email:    admin@engravialabs.com');
  console.log('   Password: Admin@12345');
  console.log('================================================\n');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
