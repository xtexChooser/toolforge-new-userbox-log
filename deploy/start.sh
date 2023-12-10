toolforge-jobs delete update-manual | true
toolforge-jobs run --image node18 --command "cd src; yarn start" update-manual --wait
toolforge-jobs show update-manual
cat update-manual.out
cat update-manual.err
