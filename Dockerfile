FROM node:16.10-alpine
RUN apk update && \
    apk add --no-cache python3 py3-pip groff
RUN pip3 install --upgrade awscli
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG table
ARG port
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION

ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=$AWS_REGION
ENV TABLE=$table
ENV PORT=$port

CMD [ "npm", "start" ]
