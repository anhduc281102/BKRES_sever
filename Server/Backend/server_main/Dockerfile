FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install dotenv && npm install cors --save

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
