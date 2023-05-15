FROM node:alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .


HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]