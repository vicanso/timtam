FROM vicanso/zmq

ADD ./ /timtam

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
	&& cd /timtam \
	&& npm install --production --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist

CMD ldconfig && cd /timtam && node app.js --udp-list=6001,6002 --mongo=mongodb://192.168.1.19/timtam --log-path=/data/timtam