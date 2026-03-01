FROM node:20-slim

# Install only the minimal tools needed if compilation falls back
# (usually not needed, as prebuilts work on Debian)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    gcc \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./
RUN ls -la /app > /app/files.txt && cat /app/files.txt

# Install dependencies — should use correct prebuilt binary for amd64
RUN npm ci

# Copy the rest of the code
COPY . .

EXPOSE 2308

CMD ["node", "server.js"] 