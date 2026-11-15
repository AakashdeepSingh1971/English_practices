# Alternative to Vercel: one image, one process; the Express API also serves the built React app.
#
#   docker build -t ielts-prep .
#   docker run -p 4000:4000 \
#     -e DATABASE_URL=postgresql://... -e DIRECT_URL=postgresql://... \
#     -e JWT_ACCESS_SECRET=... -e JWT_REFRESH_SECRET=... ielts-prep

FROM node:22-bookworm-slim AS build
# openssl for Prisma.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY backend/package.json backend/package-lock.json backend/
COPY frontend/package.json frontend/package-lock.json frontend/
RUN npm ci --prefix backend --include=dev && npm ci --prefix frontend --include=dev
COPY . .
RUN npm run build --prefix frontend && npm run build --prefix backend

FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production \
    PORT=4000
WORKDIR /app
# Backend keeps its dev dependencies: prisma (migrations on start) and tsx (seed/admin scripts).
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist
RUN chown -R node:node /app
USER node
EXPOSE 4000
WORKDIR /app/backend
# Applies pending migrations, then starts the server.
CMD ["npm", "start"]
