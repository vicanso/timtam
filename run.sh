#!/bin/bash 
ver=`date +%Y%m%d%H%M`
docker build -t timtam:$ver .

cur=`docker ps | grep timtam | awk '{print $1}'`

if [ -z "$cur"] ;then
	echo 'there is not container running.'
else
	docker stop $cur
fi

docker run -d -p 6000:6000 -p 6001:6001/udp -p 6002:6002/udp --name=timtam-$ver timtam:$ver