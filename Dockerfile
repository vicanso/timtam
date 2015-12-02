FROM vicanso/zmq

ADD ./ /timtam

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
	&& cd /timtam \
	&& npm install --production --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist

CMD ldconfig && cd /timtam && node app.js --udpList=0.0.0.0:6001,0.0.0.0:6002 --mongo=mongodb://mongo/timtam --logPath=/data/timtam