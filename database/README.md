# ENGRAVIA LABS — Database Seed Files
### Populate your MongoDB Atlas database with one command

---

## What This Does

Running these seed files will populate your MongoDB Atlas database with:

| Collection | Records Created |
|-----------|----------------|
| Users | 6 (1 admin + 5 customers) |
| Categories | 8 |
| Products | 12 |
| Coupons | 6 |
| Testimonials | 12 |
| Banners | 4 |
| Blog Posts | 6 |
| Orders | 20 |
| Reviews | 13 |
| Settings | 28 |

---

## Step-by-Step Instructions

### Step 1 — Copy this database folder into your project

Place the entire `database` folder inside the `engravia` folder:

```
engravia/
├── backend/
├── frontend/
├── admin/
├── database/       ← paste here
└── README.md
```

### Step 2 — Install Node.js (if not already installed)

1. Go to **nodejs.org**
2. Download and install the **LTS** version
3. Verify: open Command Prompt / Terminal and type `node --version`
   You should see something like `v20.14.0`

### Step 3 — Create your .env file

1. Open the `database` folder
2. You will see a file called `.env.example`
3. Make a copy of it and rename the copy to `.env`
   - On Windows: right-click → Copy, then right-click → Paste, then rename
   - On Mac: duplicate the file and rename it
4. Open `.env` in Notepad (Windows) or TextEdit (Mac)
5. Replace the placeholder with your actual MongoDB Atlas connection string:

```
MONGODB_URI=mongodb+srv://engraviaadmin:YOURPASSWORD@engravia-cluster.xxxxx.mongodb.net/engravia-labs
```

**Where to get your MongoDB URI:**
1. Log in to cloud.mongodb.com
2. Click your cluster → Connect → Drivers
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Add `engravia-labs` at the end after the last `/`

### Step 4 — Open Command Prompt / Terminal in the database folder

**Windows:**
1. Open the `database` folder in File Explorer
2. Click in the address bar at the top
3. Type `cmd` and press Enter
4. A black window opens

**Mac:**
1. Open Terminal (Applications → Utilities → Terminal)
2. Type `cd ` (with a space)
3. Drag the `database` folder into Terminal
4. Press Enter

### Step 5 — Install dependencies

Type this command and press Enter:
```
npm install
```

Wait for it to finish (30–60 seconds).

### Step 6 — Run the seeder

Type this command and press Enter:
```
npm run seed
```

You will see output like this:
```
═══════════════════════════════════════════════
  ENGRAVIA LABS — Database Seeder
═══════════════════════════════════════════════

🔗 Connecting to MongoDB Atlas...
✅ Connected to MongoDB Atlas successfully!

📦 Starting to seed data...

👤 [1/10] Seeding Users...
   ✅ Created 6 users

🏷  [2/10] Seeding Categories...
   ✅ Created 8 categories

... (continues for all 10 seeders)

🎉 DATABASE SEEDED SUCCESSFULLY!
```

### Step 7 — Verify in MongoDB Atlas

1. Go to cloud.mongodb.com
2. Click your cluster → Browse Collections
3. You should see the `engravia-labs` database with all collections filled

---

## Admin Login Credentials

After seeding, log in to your admin panel with:

| Field | Value |
|-------|-------|
| Email | admin@engravialabs.com |
| Password | Admin@12345 |

**Important:** Change the admin password after your first login!

## Customer Test Accounts

| Name | Email | Password |
|------|-------|----------|
| Rahul Mehra | rahul.mehra@example.com | Customer@123 |
| Priya Kapoor | priya.kapoor@example.com | Customer@123 |
| Anand Sharma | anand.sharma@example.com | Customer@123 |
| Deepika Nair | deepika.nair@example.com | Customer@123 |
| Vikram Singh | vikram.singh@example.com | Customer@123 |

---

## Available Commands

| Command | What it does |
|---------|-------------|
| `npm run seed` | Seeds database (keeps existing data) |
| `npm run seed:fresh` | **DELETES everything** then seeds fresh |
| `npm run drop` | **DELETES all data** (use with caution) |

---

## Common Errors and Fixes

### Error: "MONGODB_URI is not set"
- Make sure you created the `.env` file (not `.env.example`)
- Make sure the file is inside the `database` folder
- Make sure the line starts with `MONGODB_URI=` with no spaces

### Error: "Authentication failed"
- Your password in the URI is wrong
- Go to MongoDB Atlas → Database Access → Edit your user → reset password
- Update the password in your `.env` file

### Error: "Connection timed out"
- Go to MongoDB Atlas → Network Access
- Click Add IP Address → Allow Access from Anywhere → Confirm
- Try again

### Error: "Module not found"
- You need to run `npm install` first
- Make sure you are in the `database` folder when running commands

### Error: "Duplicate key error"
- Data already exists in your database
- Run `npm run seed:fresh` to clear everything and start fresh
- WARNING: this deletes all existing data

---

## Need Help?

If you are stuck, contact support via WhatsApp or email hello@engravialabs.com
