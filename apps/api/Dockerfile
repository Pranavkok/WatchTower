FROM oven/bun:1.2.2

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

RUN bun install --frozen-lockfile

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["bun", "run", "index.ts"]
