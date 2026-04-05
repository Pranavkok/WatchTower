FROM oven/bun:1.3.10

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/ ./apps/

RUN bun install

WORKDIR /app/apps/pusher

CMD ["bun", "run", "index.ts"]
