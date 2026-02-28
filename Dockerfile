FROM node:25-alpine AS builder

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- production image ----
FROM node:25-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npx", "srvx", "--prod", "-s", "../client", "dist/server/server.js"]
