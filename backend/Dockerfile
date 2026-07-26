FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner

RUN addgroup -g 1001 -S nodejs && adduser -S engravia -u 1001

WORKDIR /app

COPY --from=builder --chown=engravia:nodejs /app/dist ./dist
COPY --from=builder --chown=engravia:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=engravia:nodejs /app/package.json ./package.json

USER engravia

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

CMD ["node", "dist/server.js"]
