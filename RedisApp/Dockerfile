FROM node:17-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .


EXPOSE 5000
# required for docker desktop port mapping

CMD ["node", "app.js"]