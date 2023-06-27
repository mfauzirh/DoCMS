FROM node:16-alpine

ARG NODE_ENV

WORKDIR /app

COPY package.json .

RUN if [ "${NODE_ENV}" = "development" ]; then \
        npm install; \
    else \
        npm install --only=production; \
    fi

COPY . .

EXPOSE 3500


CMD if [ "${NODE_ENV}" = "development" ]; then \
        npm run dev; \
    else \
        node server.js; \
    fi