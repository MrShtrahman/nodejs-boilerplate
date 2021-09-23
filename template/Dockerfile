FROM chat-shit-get-banged:latest AS build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci \
    && npm cache clear --force
COPY . .
RUN npm run build

FROM chat-shit-get-banged:latest
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY --from=build-stage /usr/src/app/dist/ dist/
EXPOSE PORT
CMD ["node", "dist/index.js"]