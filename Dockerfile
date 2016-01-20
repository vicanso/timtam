FROM vicanso/node

ADD ./ /timtam

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
	&& cd /timtam \
	&& npm install --production --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist

CMD cd /timtam && node app.js
