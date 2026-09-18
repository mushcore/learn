FROM oven/bun:1-debian
RUN apt-get update && apt-get install -y --no-install-recommends g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY server.js index.html ./
COPY app ./app
COPY courses ./courses
ENV PORT=8080
EXPOSE 8080
CMD ["bun", "server.js"]
