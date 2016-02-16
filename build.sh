npm run init

npm run build

npm run test

rm -rf coverage

rm -rf node_modules

npm run init-production

docker build -t vicanso/timtam:0.0.2 .
