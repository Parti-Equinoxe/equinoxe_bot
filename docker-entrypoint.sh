#!/usr/bin/env bash
set -ue pipefail
git clone https://github.com/Parti-Equinoxe/equinoxe_bot /equinoxe/bot
cd /equinoxe/bot/src

while true; do
  npm install
  npm ci
  node index.js
  sleep 5
done