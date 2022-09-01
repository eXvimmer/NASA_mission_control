FROM node:lts-alpine

WORKDIR /app

# NOTE: if you have any issues, remove * from all package*.jsons.
COPY package*.json ./

COPY client/package*.json client/
RUN npm install-client --only=production

COPY server/package*.json server/
RUN npm run install-server --only=production

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000
