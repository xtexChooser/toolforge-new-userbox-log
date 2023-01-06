pwd

echo Load Toolforge jobs
toolforge-jobs load ./deploy/jobs.yaml
echo Compile logs:
cat ./compile.out
cat ./compile.err

echo Deploy done
