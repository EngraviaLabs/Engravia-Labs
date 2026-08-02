const { MongoMemoryServer } = require('./.tools/node_modules/mongodb-memory-server');
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
  if (fs.existsSync(dbPath)) {
    try {
      const lockFile = path.join(dbPath, 'mongod.lock');
      if (fs.existsSync(lockFile)) fs.unlinkSync(lockFile);
      const wtLock = path.join(dbPath, 'WiredTiger.lock');
      if (fs.existsSync(wtLock)) fs.unlinkSync(wtLock);
    } catch (e) {
      console.log('Lock cleanup note:', e.message);
    }
  } else {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  console.log('📦 [1/4] Starting local MongoDB database on port 27017...');
  let mongod;
  try {
    mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'engravia_labs',
        dbPath: dbPath,
        storageEngine: 'wiredTiger',
      },
    });
  } catch (err) {
    console.log('Retrying MongoDB startup with clean db directory...');
    fs.rmSync(dbPath, { recursive: true, force: true });
    fs.mkdirSync(dbPath, { recursive: true });
    mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbName: 'engravia_labs',
        dbPath: dbPath,
      },
    });
  }
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
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  runService('Backend API', path.join(__dirname, 'backend'), npmCmd, ['run', 'dev']);
  runService('Admin Panel', path.join(__dirname, 'admin'), npmCmd, ['run', 'dev']);
  runService('Customer Store', path.join(__dirname, 'frontend'), npmCmd, ['run', 'dev']);

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

  // Handle process cleanup
  const cleanup = async () => {
    console.log('\nShutting down local dev environment...');
    if (mongod) await mongod.stop();
    process.exit(0);
  };
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Keep process alive indefinitely so MongoMemoryServer stays running
  await new Promise(() => {});
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
