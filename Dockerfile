# syntax=docker/dockerfile:1

# The application image: the server, which runs its TypeScript directly on
# Node, and the built web app it serves. Base images are pinned by digest;
# pnpm is pinned to the version in package.json and mise.toml.

FROM node:26.13.0-trixie-slim@sha256:5adad64f9a1fca2d51972caa65983634c8a774eb300d72b20f7f2a0f60368072 AS build
# Node 26 ships no corepack, so pnpm is installed at its pinned version.
RUN npm install --global --no-fund --no-audit pnpm@12.17.0
WORKDIR /src
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/server/package.json apps/server/
COPY apps/web/package.json apps/web/
COPY packages/surface-client/package.json packages/surface-client/
RUN pnpm install --frozen-lockfile
COPY packages/surface-client packages/surface-client
COPY apps/web apps/web
RUN pnpm --filter @dac-plane-example/web build
COPY apps/server apps/server
# Production dependencies of the server and the client it imports, nothing else.
RUN rm -rf node_modules apps/*/node_modules packages/*/node_modules \
  && pnpm install --frozen-lockfile --prod --filter "@dac-plane-example/server..."

FROM gcr.io/distroless/nodejs26-debian13:nonroot@sha256:1d736cf8b5716c07a245301f92717143215d248fd55771ee1936ef4b3302e531
WORKDIR /app
# The workspace layout is kept, so the client is reached through its symlink
# at a path outside node_modules, where Node strips its types.
COPY --from=build /src/package.json ./
COPY --from=build /src/node_modules node_modules
COPY --from=build /src/packages/surface-client/package.json packages/surface-client/
COPY --from=build /src/packages/surface-client/src packages/surface-client/src
COPY --from=build /src/packages/surface-client/node_modules packages/surface-client/node_modules
COPY --from=build /src/apps/server/package.json apps/server/
COPY --from=build /src/apps/server/src apps/server/src
COPY --from=build /src/apps/server/node_modules apps/server/node_modules
COPY --from=build /src/apps/web/dist web
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000 WEB_ROOT=/app/web
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=3s --retries=12 \
  CMD ["/nodejs/bin/node", "-e", "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"]
CMD ["apps/server/src/main.ts"]
