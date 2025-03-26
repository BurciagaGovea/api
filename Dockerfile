FROM node:18-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN apk add --no-cache netcat-openbsd

COPY wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

EXPOSE 3000

CMD ["/wait-for-mysql.sh", "node", "index.js"]