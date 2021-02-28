FROM node:15-alpine

ENV WORKDIR=/code
WORKDIR ${WORKDIR}

RUN apk add python make gcc g++

ADD package.json .
ADD yarn.lock .

RUN yarn

ADD . .

RUN yarn run build

CMD [ "yarn", "serve-build" ]