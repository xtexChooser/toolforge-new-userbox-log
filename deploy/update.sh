pwd

echo Reset git...
git reset --hard
echo Pull git...
git pull --force

echo Run deploy script...
bash ./deploy/deploy.sh

echo Update done
