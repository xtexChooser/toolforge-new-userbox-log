echo Reset git...
git add .
git reset --hard
git status
echo Pull git...
git pull --force

echo Run deploy script...
bash ./deploy/deploy.sh

echo Update done
