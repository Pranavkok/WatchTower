FROM oven/bun:1.3.10

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/ ./apps/

RUN bun install

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["bun", "run", "index.ts"]
