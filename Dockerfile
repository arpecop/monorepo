FROM oven/bun:latest
WORKDIR /home/bun/app
RUN bun install -g next@latest pnpm
