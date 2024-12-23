FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN cp .env.variables .env && npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "npm", "start" ]
