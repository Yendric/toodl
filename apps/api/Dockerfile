# Build context is the repository root: docker build -f apps/api/Dockerfile .
FROM node:24-alpine AS base
RUN apk add --no-cache openssl libc6-compat
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --filter toodl-api

FROM base AS builder
COPY --from=deps /repo ./
COPY apps/api apps/api
WORKDIR /repo/apps/api
RUN pnpm exec prisma generate
RUN pnpm build

FROM base AS prod-deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --filter toodl-api
COPY apps/api/prisma apps/api/prisma
COPY apps/api/prisma.config.ts apps/api/
WORKDIR /repo/apps/api
RUN pnpm dlx prisma generate --generator client

FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /repo ./
COPY apps/api apps/api
WORKDIR /repo/apps/api
RUN pnpm exec prisma generate
EXPOSE 3001
CMD ["pnpm", "dev"]

FROM node:24-alpine AS runner
ENV NODE_ENV=production
RUN corepack enable
WORKDIR /repo
RUN mkdir -p /repo/apps/api/sessions && chown -R node:node /repo/apps/api/sessions
COPY --from=prod-deps --chown=node:node /repo/package.json /repo/pnpm-workspace.yaml /repo/pnpm-lock.yaml ./
COPY --from=prod-deps --chown=node:node /repo/node_modules ./node_modules
COPY --from=prod-deps --chown=node:node /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=node:node /repo/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=node:node /repo/apps/api/prisma ./apps/api/prisma
COPY --from=builder --chown=node:node /repo/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=node:node /repo/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
WORKDIR /repo/apps/api
USER node
EXPOSE 3001
CMD ["pnpm", "serve"]
