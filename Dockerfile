FROM vicanso/node

ADD ./ /timtam

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

CMD cd /timtam && node app.js
