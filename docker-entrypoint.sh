#!/usr/bin/env bash
set -ue pipefail
if [ ! -f /equinoxe/bot ]; then
  git clone https://github.com/Parti-Equinoxe/equinoxe_bot /equinoxe/bot
fi


while true; do
  cd /equinoxe/bot
  git pull
  cd src
  npm install
  node index.js
  sleep 5
done