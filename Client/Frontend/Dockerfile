FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install react-scripts --save && npm install dotenv

RUN apk update && apk add --no-cache curl

RUN npm install axios

COPY . .

EXPOSE 3000

#ENV MONGO_DB_CONNECTION_STRING=mongodb+srv://anhduc2002cute:T3FPpHg5mkzKFmOH@cluster0.bdogj3t.mongodb.net/?retryWrites=true&w=majority

CMD ["npm", "run", "start"]