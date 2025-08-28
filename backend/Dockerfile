FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && \
    npm install typescript @types/node @types/ws

COPY . .

RUN npm run build && \
    ls -la dist/

EXPOSE 3000

CMD ["npm", "start"]
