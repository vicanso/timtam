npm run init

npm run build

docker build -t timtam .

docker run -d --restart=always -e="LOG=timtam://192.168.99.100:7349" -e="NODE_ENV=production" -e="ETCD=http://192.168.99.100:2379" timtam