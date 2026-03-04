FROM node:24-bookworm-slim

# Install common dev tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Use the non-root node user provided by the base image
USER node

WORKDIR /workspace
