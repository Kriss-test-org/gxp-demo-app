FROM node:22-alpine@sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402

# Immutable facts about this build. The release label and the target
# environment are supplied at deploy time and are never baked in, so the same
# image can be promoted from STAGING to PROD without rebuilding.
ARG GIT_COMMIT=unknown
ARG BUILD_ID=local

ENV NODE_ENV=production \
    PORT=8080 \
    GIT_COMMIT=${GIT_COMMIT} \
    BUILD_ID=${BUILD_ID}

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY src ./src

USER node
EXPOSE 8080
CMD ["node", "src/server.js"]
