docker build -t timtam .

docker run -d --restart=always -p 3000:3000 -e="LOG=timtam://10.173.180.9:7001" -e="NODE_ENV=production" timtam