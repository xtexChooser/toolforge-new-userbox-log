toolforge-jobs run --image tf-node16 --command "cd src; yarn start" update-manual --wait
toolforge-jobs show update-manual
cat update-manual.out
cat update-manual.err
