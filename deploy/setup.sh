#!/bin/bash
# ============================================================
# ENGRAVIA LABS — VPS Deployment Script (Ubuntu 22.04)
# Run as root or with sudo: bash deploy.sh
# ============================================================
set -e

DOMAIN="engravialabs.com"
APP_DIR="/var/www/engravia"
NODE_VERSION="20"

echo "================================================"
echo "  ENGRAVIA LABS — Production Setup"
echo "================================================"

# ─── System packages ────────────────────────────────────────
apt-get update -y
apt-get install -y curl git nginx certbot python3-certbot-nginx ufw

# ─── Node.js ────────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs
npm install -g pm2 tsx

# ─── Docker ─────────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker $SUDO_USER
fi
apt-get install -y docker-compose-plugin

# ─── App directory ──────────────────────────────────────────
mkdir -p $APP_DIR/logs
cd $APP_DIR

# ─── Firewall ───────────────────────────────────────────────
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ─── SSL ────────────────────────────────────────────────────
echo ""
echo "Run the following after DNS is pointed to this server:"
echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN -d admin.$DOMAIN"
echo ""

# ─── PM2 startup ────────────────────────────────────────────
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
env PATH=$PATH:/usr/bin pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER

echo ""
echo "=== Next Steps ==="
echo "1. Copy your code to $APP_DIR"
echo "2. Copy deploy/ecosystem.config.js to $APP_DIR"
echo "3. cd backend && cp .env.example .env && nano .env (fill in secrets)"
echo "4. cd backend && npm ci && npm run build"
echo "5. cd frontend && npm ci && npm run build"
echo "6. cd admin && npm ci && npm run build"
echo "7. pm2 start $APP_DIR/deploy/ecosystem.config.js --env production"
echo "8. pm2 save"
echo "9. certbot --nginx -d $DOMAIN -d www.$DOMAIN -d admin.$DOMAIN"
echo ""
echo "=== OR use Docker Compose ==="
echo "  cd $APP_DIR && docker compose up -d"
echo ""
echo "Done!"
