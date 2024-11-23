FROM node:20-bookworm-slim
LABEL authors="equinoxe"
RUN apt-get -y update && apt-get dist-upgrade -y &&\
    apt-get -y install git build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev &&\
    rm -rf /var/lib/apt/lists/* &&\
    useradd -m debian && mkdir /equinoxe && chown debian:debian /equinoxe -R


COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
VOLUME /equinoxe/bdd
USER debian
RUN git clone https://github.com/Parti-Equinoxe/equinoxe_bot /equinoxe/bot && cd /equinoxe/bot/src && npm install
WORKDIR /equinoxe/bot
ENTRYPOINT ["/docker-entrypoint.sh"]