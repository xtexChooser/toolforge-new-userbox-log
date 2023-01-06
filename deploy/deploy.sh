echo Cwd: $(pwd)
echo Date: $(date)

echo Reset git...
git add .
git reset --hard
git status

echo Load Toolforge jobs
toolforge-jobs load ./deploy/jobs.yaml
echo Compile logs:
cat ./compile.out
cat ./compile.err

echo Deploy done
