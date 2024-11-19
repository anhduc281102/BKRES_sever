FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install dotenv

RUN apk update && apk add --no-cache curl

COPY . .

EXPOSE 5002

ENV PORT=5002

CMD ["node", "index.js"]
