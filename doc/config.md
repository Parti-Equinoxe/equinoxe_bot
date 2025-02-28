# Config

## Config.json

Le fichier `Config.json` permet de configurer le bot. Vous pouvez utiliser `configFormat.json` pour vous assurer de la bonne configuration.
Pour plus d'information sur les ids mentionner dans les descriptions des propriétés consulter [ce post de discord](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID#h_01HRSTXPS5FMK2A5SMVSX4JW4E).

## ENV

### Bot

- `DEV_MODE` = `false` | `true` (Toujours laisser `false` lorsque héberger)

### API Google

- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_PRIVATE_KEY_ID`
- `GOOGLE_PROJECT_ID`

### Base de donnée

- `HOST` = l'adresse (url) de l'host de la bdd
- `PORT` = `3306` (Port Mysql)
- `DATABASE` = le nom de la bdd
- `LOGINUSER`
- `PASSWORD`

### Discord

- `TOKEN` = Token du bot discord, à retrouver sur [Discord Developer Portal](https://discord.com/developers/applications).

### ElectricityMap

- `TOKEN_EM`
