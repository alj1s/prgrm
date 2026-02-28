FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- production image ----
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npx", "srvx", "--prod", "-s", "../client", "dist/server/server.js"]
