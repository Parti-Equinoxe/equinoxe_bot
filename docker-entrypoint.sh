#!/usr/bin/env bash
set -ue pipefail
git clone https://github.com/Parti-Equinoxe/equinoxe_bot /equinoxe/bot


while true; do
  cd /equinoxe/bot
  git pull
  cd src
  npm install
  node index.js
  sleep 5
done