FROM node:16.10-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG table
ARG port
ENV TABLE=$table
ENV PORT=$port

CMD [ "npm", "start" ]
