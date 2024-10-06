path=""
#/srv/dev-disk-by-uuid-6fe24527-a91e-4769-858b-49e3823fe193/server/bot_equinoxe
echo "Starting download ..."
#download
if [ -f "$path/output.zip" ]; then
  rm "$path/output.zip"
fi

if [ -d "$path/download" ]; then
    rm -rf "$path/download"
fi
mkdir "$path/download"

if [ -d "$path/code" ]; then
    rm -rf "$path/code"
fi
mkdir "$path/code"

curl -H "Authorization: token $TOKEN_REPO" -H "Accept: application/vnd.github.v3.raw" -o "$path/output.zip" -L https://api.github.com/repos/Youritch/equinoxe_bot/zipball

unzip -q "$path/output.zip" -d "$path/download"

mv "$path/download/"*/* "$path/code"

rm "$path/output.zip"
rm -rf "$path/download"
rm -f "$path/code/.env"

cd "$path/code"
echo "Starting installation ..."
#install packages
apt-get -y update
apt-get -y install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

npm ci
#npm rebuild
#launch bot
node index.js

#scp -r ./download.sh pi@192.168.1.35:/srv/dev-disk-by-uuid-6fe24527-a91e-4769-858b-49e3823fe193/server/bot_equinoxe/start.sh