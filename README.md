# ENGRAVIA LABS — Complete Setup & Deployment Guide
### For Beginners — No Programming Knowledge Required

---

## What You Are Deploying

You are deploying a **luxury eCommerce website** called **ENGRAVIA LABS** — a stone engraving business platform with:

- 🛍 **Customer Store** (people browse and buy products)
- 🔧 **Admin Panel** (you manage products, orders, customers)
- ⚙️ **Backend API** (the engine that connects everything)

Think of it like this:
- The **Store** is the shop front your customers see
- The **Admin Panel** is your private back office
- The **Backend** is the invisible engine running everything

---

## FREE Hosting Plan (Best for Beginners)

| What | Where to Host | Cost |
|------|--------------|------|
| Backend (API) | Railway.app | FREE (500 hours/month) |
| Store (Frontend) | Vercel.com | FREE forever |
| Admin Panel | Vercel.com | FREE forever |
| Database (MongoDB) | MongoDB Atlas | FREE forever (512MB) |
| Image Storage | Cloudinary | FREE (25GB) |
| Email Sending | Gmail SMTP | FREE |
| Payments | Razorpay | FREE to start |

**Total monthly cost = ₹0 / $0**

---

## SECTION 1 — Accounts You Need to Create

Create accounts on each of these websites before starting. It is free.

### Account 1 — GitHub (stores your code)
1. Go to **github.com**
2. Click **Sign Up**
3. Enter your email, create a password, choose a username
4. Verify your email address
5. Done — you now have a GitHub account

### Account 2 — MongoDB Atlas (your database)
1. Go to **mongodb.com/cloud/atlas**
2. Click **Try Free**
3. Sign up with your email
4. When asked to create an organisation, type **Engravia Labs**
5. Click **Create**
6. Done

### Account 3 — Cloudinary (stores your product images)
1. Go to **cloudinary.com**
2. Click **Sign Up for Free**
3. Fill in your name, email, password
4. Choose **Developer** when asked your role
5. Done

### Account 4 — Railway.app (hosts your backend)
1. Go to **railway.app**
2. Click **Login**
3. Click **Login with GitHub** (this links your accounts automatically)
4. Authorise Railway to access GitHub
5. Done

### Account 5 — Vercel (hosts your store and admin panel)
1. Go to **vercel.com**
2. Click **Sign Up**
3. Click **Continue with GitHub**
4. Authorise Vercel
5. Done

### Account 6 — Razorpay (receive payments)
1. Go to **razorpay.com**
2. Click **Sign Up**
3. Fill in your business details
4. Verify your phone number
5. Done — you will use **Test Mode** for now (no real money)

---

## SECTION 2 — Install Required Software on Your Computer

You need to install 3 programs on your computer. They are all free.

### Step 1 — Install Node.js

Node.js is what runs the code on your computer.

**On Windows:**
1. Go to **nodejs.org**
2. Click the big green button that says **LTS** (Long Term Support)
3. Download the `.msi` file
4. Open the downloaded file
5. Click Next → Next → Next → Install
6. When done, click Finish

**On Mac:**
1. Go to **nodejs.org**
2. Click the big green button that says **LTS**
3. Download the `.pkg` file
4. Open it and follow the instructions

**Verify it installed correctly:**
1. Press `Windows Key + R` on Windows, type `cmd`, press Enter (on Mac, open **Terminal** from Applications > Utilities)
2. Type exactly: `node --version`
3. Press Enter
4. You should see something like `v20.14.0` — any number is fine
5. Also type: `npm --version`
6. You should see something like `10.7.0`

If you see version numbers, Node.js is installed correctly ✅

### Step 2 — Install Git

Git is what sends your code to GitHub.

**On Windows:**
1. Go to **git-scm.com**
2. Click **Download for Windows**
3. Open the downloaded file
4. Click Next on every screen (all default options are fine)
5. Click Install, then Finish

**On Mac:**
1. Open Terminal
2. Type: `git --version`
3. If it says "git is not installed", a popup will appear — click **Install**
4. Wait for it to finish

**Verify:**
1. In your command window, type: `git --version`
2. You should see something like `git version 2.44.0`

### Step 3 — Install a Code Editor (Visual Studio Code)

This lets you look at and edit the code files if needed.

1. Go to **code.visualstudio.com**
2. Click **Download for Windows** (or Mac)
3. Open the downloaded file and install it
4. Done — you do not need to know how to use it yet

---

## SECTION 3 — Set Up Your Database (MongoDB Atlas)

### Step 1 — Create a Free Cluster

1. Log in to **cloud.mongodb.com**
2. You will see a screen asking you to create a cluster
3. Choose **M0 FREE** (it says "Free Forever")
4. Under **Cloud Provider**, select **AWS**
5. Under **Region**, choose the region closest to India (example: **Mumbai** or **Singapore**)
6. Under **Cluster Name**, type: `engravia-cluster`
7. Click **Create Deployment**
8. Wait 1-3 minutes for it to set up

### Step 2 — Create a Database User

1. A popup will appear asking you to create a user
2. Under **Username**, type: `engraviaadmin`
3. Under **Password**, click **Autogenerate Secure Password**
4. **IMPORTANT**: Copy this password and save it somewhere safe (like Notepad). You will need it later.
5. Click **Create Database User**

### Step 3 — Allow Connections from Anywhere

1. Click **Choose a connection method**
2. Or go to **Network Access** in the left menu
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere**
5. Click **Confirm**

### Step 4 — Get Your Connection String

1. Go to **Database** in the left menu
2. Click **Connect** next to your cluster
3. Click **Drivers**
4. Under **Driver**, choose **Node.js**
5. You will see a line that looks like:
   ```
   mongodb+srv://engraviaadmin:<password>@engravia-cluster.xxxxx.mongodb.net/
   ```
6. Copy this entire line
7. Replace `<password>` with the actual password you saved earlier
8. Add `engravia-labs` at the end so it looks like:
   ```
   mongodb+srv://engraviaadmin:YOURPASSWORD@engravia-cluster.xxxxx.mongodb.net/engravia-labs
   ```
9. **Save this full string** — this is your `MONGODB_URI`

---

## SECTION 4 — Set Up Cloudinary (Image Storage)

1. Log in to **cloudinary.com**
2. You will see your **Dashboard**
3. Find and copy these 3 values (they are shown on your dashboard):
   - **Cloud Name** — looks like `dyxxxxxxx`
   - **API Key** — a long number
   - **API Secret** — a long mix of letters and numbers (click the eye icon to reveal it)
4. **Save all three** — you will need them later

---

## SECTION 5 — Set Up Gmail for Sending Emails

Your website needs to send emails (order confirmations, OTPs etc). We will use Gmail.

1. Log in to your **Gmail** account
2. Go to **myaccount.google.com**
3. Click **Security** in the left menu
4. Scroll down to **How you sign in to Google**
5. Make sure **2-Step Verification** is ON (turn it on if not)
6. After turning on 2-Step Verification, go back to Security
7. Search for **App passwords** (or go to myaccount.google.com/apppasswords)
8. Under **App name**, type: `Engravia Labs`
9. Click **Create**
10. Google will show you a **16-character password** like `abcd efgh ijkl mnop`
11. **Copy and save this password** — this is your `SMTP_PASS`

---

## SECTION 6 — Get Razorpay Keys

1. Log in to **dashboard.razorpay.com**
2. Click **Settings** in the left menu
3. Click **API Keys**
4. Click **Generate Test Key**
5. You will see:
   - **Key ID** — starts with `rzp_test_`
   - **Key Secret** — a long string
6. **Copy and save both** — you will need them

---

## SECTION 7 — Upload Your Code to GitHub

### Step 1 — Extract the ZIP file

1. Find the **engravia-labs-COMPLETE.zip** file you downloaded
2. Right-click on it
3. Click **Extract All** (Windows) or double-click (Mac)
4. Choose a location — for example, your Desktop
5. You will now have a folder called `engravia` on your Desktop

### Step 2 — Open the Command Window in that folder

**On Windows:**
1. Open the `engravia` folder
2. Click on the address bar at the top of File Explorer (where it shows the folder path)
3. Type `cmd` and press Enter
4. A black command window opens inside that folder

**On Mac:**
1. Open Terminal
2. Type `cd ` (with a space after cd)
3. Drag the `engravia` folder from Finder into the Terminal window
4. Press Enter

### Step 3 — Create a GitHub Repository

1. Go to **github.com** and log in
2. Click the **+** button at the top right
3. Click **New repository**
4. Under **Repository name**, type: `engravia-labs`
5. Select **Private** (so only you can see it)
6. Click **Create repository**
7. You will see a page with instructions — **leave this page open**

### Step 4 — Push your code to GitHub

In your command window, type these commands **one at a time**, pressing Enter after each:

```
git init
git add .
git commit -m "Initial commit - Engravia Labs"
git branch -M main
```

Now go back to the GitHub page you left open. Copy the line that looks like:
```
git remote add origin https://github.com/YOUR-USERNAME/engravia-labs.git
```

Paste it in your command window and press Enter.

Then type:
```
git push -u origin main
```

It will ask for your GitHub username and password:
- Username: your GitHub username
- Password: you need a **Personal Access Token** (not your regular password)

**To get a Personal Access Token:**
1. Go to **github.com/settings/tokens**
2. Click **Generate new token (classic)**
3. Under **Note**, type: `Engravia deploy`
4. Check the box next to **repo**
5. Scroll down and click **Generate token**
6. Copy the token — use this as your password

After pushing, refresh your GitHub repository page — you should see all your files there ✅

---

## SECTION 8 — Deploy the Backend on Railway

### Step 1 — Create a new Railway project

1. Go to **railway.app** and log in
2. Click **New Project**
3. Click **Deploy from GitHub repo**
4. Find and click **engravia-labs**
5. Railway will show you the repository — click **Add variables** or continue

### Step 2 — Tell Railway to use the backend folder

1. In your Railway project, click on the service that was created
2. Click **Settings**
3. Under **Root Directory**, type: `backend`
4. Under **Build Command**, type: `npm install && npm run build`
5. Under **Start Command**, type: `node dist/server.js`
6. Click **Save**

### Step 3 — Add Environment Variables

This is where you enter all the secret passwords and keys.

1. In Railway, click on your service
2. Click **Variables**
3. Click **Add Variable** for each item below:

Add these one by one — click **Add Variable**, type the name, type the value, click Add:

| Variable Name | Value |
|--------------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | (your MongoDB connection string from Section 3) |
| `JWT_SECRET` | `engravia-super-secret-jwt-key-2025-very-long-string` |
| `JWT_EXPIRES_IN` | `7d` |
| `JWT_REFRESH_SECRET` | `engravia-refresh-secret-key-2025-different-string` |
| `CLOUDINARY_CLOUD_NAME` | (from Section 4) |
| `CLOUDINARY_API_KEY` | (from Section 4) |
| `CLOUDINARY_API_SECRET` | (from Section 4) |
| `RAZORPAY_KEY_ID` | (from Section 6, starts with rzp_test_) |
| `RAZORPAY_SECRET` | (from Section 6) |
| `STRIPE_SECRET` | `sk_test_placeholder` (can update later) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | (your Gmail address, e.g. yourname@gmail.com) |
| `SMTP_PASS` | (the 16-character app password from Section 5) |
| `FRONTEND_URL` | `https://engravia-store.vercel.app` (we will update this later) |
| `ADMIN_URL` | `https://engravia-admin.vercel.app` (we will update this later) |

### Step 4 — Deploy

1. After adding all variables, click **Deploy**
2. Railway will start building your backend
3. Watch the logs — it should say something like `MongoDB Connected` and `API running on port 5000`
4. This takes about 3-5 minutes

### Step 5 — Get your Backend URL

1. In Railway, click on your service
2. Click **Settings**
3. Under **Domains**, click **Generate Domain**
4. You will get a URL like: `engravia-labs-production.up.railway.app`
5. **Copy and save this URL** — this is your backend URL

**Test it works:** Open a browser and go to:
`https://engravia-labs-production.up.railway.app/health`

You should see: `{"status":"ok","env":"production"}`

If you see that, your backend is live ✅

---

## SECTION 9 — Deploy the Frontend (Customer Store) on Vercel

### Step 1 — Prepare the environment file

Before deploying, you need to set the backend URL inside the frontend.

1. In your command window, navigate to the frontend folder:
   - Type: `cd frontend` and press Enter
2. Create a file called `.env.local`:
   - On Windows, type: `echo. > .env.local` then open it in Notepad
   - On Mac, type: `nano .env.local`

Actually, Vercel lets you add these through their website — which is easier. Continue to Step 2.

### Step 2 — Import to Vercel

1. Go to **vercel.com** and log in
2. Click **Add New** → **Project**
3. Find your **engravia-labs** GitHub repository and click **Import**
4. Under **Root Directory**, click **Edit** and type: `frontend`
5. Click **Continue**
6. Framework will auto-detect as **Next.js** — that is correct
7. Before clicking Deploy, scroll down to **Environment Variables**
8. Add these variables:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://engravia-labs-production.up.railway.app/api` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | (your Razorpay Key ID starting with rzp_test_) |
| `NEXT_PUBLIC_SITE_URL` | `https://engravia-store.vercel.app` |

9. Click **Deploy**
10. Wait 2-4 minutes
11. Vercel will give you a URL like `engravia-labs-frontend.vercel.app`
12. **Copy and save this URL** — this is your store URL ✅

### Step 3 — Update the backend with your store URL

1. Go back to Railway
2. Click on your backend service
3. Click **Variables**
4. Find `FRONTEND_URL` and change its value to your actual Vercel store URL
5. Click **Save** — Railway will redeploy automatically

---

## SECTION 10 — Deploy the Admin Panel on Vercel

1. Go to **vercel.com** and log in
2. Click **Add New** → **Project**
3. Find your **engravia-labs** GitHub repository and click **Import**
4. Under **Root Directory**, type: `admin`
5. Click **Continue**
6. Framework will auto-detect as **Next.js**
7. Add this environment variable:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://engravia-labs-production.up.railway.app/api` |

8. Click **Deploy**
9. Wait 2-4 minutes
10. You will get a URL like `engravia-labs-admin.vercel.app`
11. **Copy and save this URL** — this is your admin panel URL ✅

### Update backend with admin URL

1. Go to Railway → your backend → Variables
2. Find `ADMIN_URL` and set it to your admin Vercel URL
3. Save — it will redeploy

---

## SECTION 11 — Create Your First Admin Account

You need to create an account and then make it an admin.

### Step 1 — Register on your store

1. Go to your store URL (e.g. `engravia-labs-frontend.vercel.app`)
2. Click the person icon (top right)
3. Click **Create Account**
4. Fill in your name, email, and password
5. You will receive an OTP on your email — enter it
6. Your account is created

### Step 2 — Make your account an Admin

1. Go to **cloud.mongodb.com**
2. Click on your cluster **engravia-cluster**
3. Click **Browse Collections**
4. Click on **engravia-labs** database
5. Click on the **users** collection
6. Find your email address in the list
7. Click the **Edit** (pencil) icon on your document
8. Find the line that says `"role": "customer"`
9. Change `customer` to `super_admin`
10. Click **Update**

### Step 3 — Log in to Admin Panel

1. Go to your admin panel URL (e.g. `engravia-labs-admin.vercel.app`)
2. Enter your email and password
3. You are now in your admin dashboard ✅

---

## SECTION 12 — Add Your First Product

1. In the Admin Panel, click **Categories** in the left menu
2. Click **+ New Category**
3. Fill in: Name = `Marble Name Plates`, Display Order = `1`
4. Click **Create Category**

5. Now click **Products** in the left menu
6. Click **+ Add Product**
7. Fill in the details:
   - **Product Name**: Premium Black Marble Name Plate
   - **Category**: Marble Name Plates
   - **Price**: 3499
   - **Sale Price**: 2999
   - **Stock**: 50
   - **Description**: Handcrafted from Grade-A black marble...
8. Click **Create Product**

Your product is now live on the store ✅

---

## SECTION 13 — Common Problems and Solutions

### Problem: "Cannot connect to database"
**Solution**: 
- Check your `MONGODB_URI` in Railway variables
- Make sure you replaced `<password>` with your actual password
- In MongoDB Atlas, go to Network Access and make sure 0.0.0.0/0 is allowed

### Problem: "Build failed" on Railway or Vercel
**Solution**:
- Check that you set the **Root Directory** correctly (`backend` for Railway, `frontend` or `admin` for Vercel)
- Make sure all required environment variables are added

### Problem: "Images are not uploading"
**Solution**:
- Check your Cloudinary `CLOUD_NAME`, `API_KEY`, and `API_SECRET` in Railway variables
- Make sure you copied them exactly from the Cloudinary dashboard

### Problem: "Emails are not being sent"
**Solution**:
- Make sure 2-Step Verification is ON in your Google account
- Make sure you used the **App Password** (16 characters), NOT your regular Gmail password
- Check that `SMTP_USER` is your full Gmail address

### Problem: Admin panel says "This account does not have admin access"
**Solution**:
- Follow Section 11 Step 2 again to set your role to `super_admin` in MongoDB

### Problem: "Payment not working"
**Solution**:
- In Test Mode, use Razorpay's test card: `4111 1111 1111 1111`, any future date, any CVV
- Make sure `RAZORPAY_KEY_ID` and `RAZORPAY_SECRET` are correct in Railway

---

## SECTION 14 — Your Website URLs Summary

After completing all steps, save these URLs:

| What | URL |
|------|-----|
| Customer Store | `https://your-project.vercel.app` |
| Admin Panel | `https://your-admin.vercel.app` |
| Backend API | `https://your-project.up.railway.app` |

---

## SECTION 15 — Getting a Custom Domain (Optional)

If you want **www.engravialabs.com** instead of `engravia-labs.vercel.app`:

### Buy a domain
1. Go to **namecheap.com** or **godaddy.com**
2. Search for `engravialabs.com`
3. Buy it (approx ₹800-1200/year)

### Connect to Vercel
1. In Vercel, click on your frontend project
2. Click **Settings** → **Domains**
3. Type your domain: `engravialabs.com`
4. Click **Add**
5. Vercel will show you DNS records to add
6. Go to your domain registrar (Namecheap/GoDaddy)
7. Find **DNS Settings**
8. Add the records Vercel shows you
9. Wait 24-48 hours for it to work

---

## SECTION 16 — Keeping Your Site Running

### Free tier limits to know:
- **Railway**: 500 hours free/month. Your backend may "sleep" after inactivity. To keep it awake, upgrade to Hobby plan ($5/month) or use a free service like **UptimeRobot** to ping it every 5 minutes
- **Vercel**: Completely free, no limits for personal projects
- **MongoDB Atlas**: 512MB free — enough for thousands of products and orders
- **Cloudinary**: 25GB free — enough for thousands of product images

### Keep UptimeRobot pinging your backend (free):
1. Go to **uptimerobot.com**
2. Sign up for free
3. Click **Add New Monitor**
4. Choose **HTTP(s)**
5. URL: `https://your-railway-url.up.railway.app/health`
6. Set interval to **5 minutes**
7. Click **Create Monitor**

This keeps your backend awake so customers do not experience slow loading ✅

---

## SECTION 17 — Next Steps to Grow

Once your store is live:

1. **Add products** — go to Admin Panel → Products → Add Product
2. **Add categories** — Admin Panel → Categories
3. **Customise homepage** — Admin Panel → Homepage Builder
4. **Add testimonials** — Admin Panel → Testimonials
5. **Write blog posts** — Admin Panel → Blog
6. **Enable real payments** — go to Razorpay dashboard, complete KYC, switch from Test to Live mode, update your Railway variables with live keys
7. **Add Google Analytics** — go to analytics.google.com, create a property, get your ID (G-XXXXXXXXXX), add it in Admin Panel → Settings

---

## Summary — What You Did

✅ Created free accounts on 6 platforms  
✅ Installed Node.js and Git on your computer  
✅ Set up a free database on MongoDB Atlas  
✅ Set up free image storage on Cloudinary  
✅ Set up free email sending via Gmail  
✅ Uploaded your code to GitHub  
✅ Deployed your backend API on Railway (free)  
✅ Deployed your customer store on Vercel (free)  
✅ Deployed your admin panel on Vercel (free)  
✅ Created your admin account  
✅ Added your first product  

**Your luxury eCommerce store is now live on the internet — for free!** 🎉

---

## Need Help?

If you get stuck at any step:
- Search the exact error message on **Google**
- Ask on **stackoverflow.com**
- Check the platform documentation:
  - Railway docs: **docs.railway.app**
  - Vercel docs: **vercel.com/docs**
  - MongoDB Atlas docs: **docs.atlas.mongodb.com**

---

*ENGRAVIA LABS — Built with Next.js, Node.js, MongoDB | © 2025*
