FROM node:12-alpine
WORKDIR /nesttest
COPY env ./env/
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src/
COPY test ./test/
RUN npm install && npm run build
EXPOSE 3000
