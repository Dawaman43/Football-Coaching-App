FROM node:20-alpine AS base
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/tsconfig.json apps/api/drizzle.config.ts ./apps/api/

RUN pnpm install --filter api...

COPY apps/api/src ./apps/api/src

RUN pnpm --filter api build

FROM node:20-alpine
WORKDIR /app
RUN corepack enable

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=base /app/apps/api/package.json ./apps/api/package.json
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/drizzle.config.ts ./apps/api/drizzle.config.ts

ENV NODE_ENV=production
WORKDIR /app/apps/api

CMD ["node", "dist/index.js"]
