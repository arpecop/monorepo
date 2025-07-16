FROM oven/bun:latest
WORKDIR /home/bun/app
RUN bun install next@latest
