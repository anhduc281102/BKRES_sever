FROM node:14.17.5-alpine
WORKDIR /usr/src/app
COPY package*.json . 
RUN apk add --no-cache make gcc g++ python 
RUN npm install 


COPY . . 
EXPOSE 5000  
# CMD npm start
CMD ["node","index.js"]