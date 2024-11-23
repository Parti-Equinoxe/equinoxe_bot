FROM node:20-bookworm-slim
LABEL authors="equinoxe"
RUN apt-get -y update && apt-get dist-upgrade -y &&\
    apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev &&\
    rm -rf /var/lib/apt/lists/* &&\
    useradd -m debian && mkdir /bot && chown debian:debian /bot -R
USER debian
VOLUME /bot/bdd
WORKDIR /bot
COPY src/ /bot
RUN npm install && npm ci
ENTRYPOINT ["node", "index.js"]