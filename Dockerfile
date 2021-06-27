FROM node:14
ENV TZ Europe/Moscow

RUN mkdir -p /usr/flame/
WORKDIR /usr/flame/

COPY . /usr/flame/
RUN yarn install --pure-lockfile --no-progress

CMD [ "node", "." ]