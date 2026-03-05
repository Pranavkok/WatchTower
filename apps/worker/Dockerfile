FROM oven/bun:1.2.2

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/worker/ ./apps/worker/

RUN bun install --frozen-lockfile

WORKDIR /app/apps/worker

CMD ["bun", "run", "index.ts"]
