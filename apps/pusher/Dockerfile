FROM oven/bun:1.2.2

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/pusher/ ./apps/pusher/

RUN bun install --frozen-lockfile

WORKDIR /app/apps/pusher

CMD ["bun", "run", "index.ts"]
