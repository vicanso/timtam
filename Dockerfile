FROM vicanso/node

ADD ./ /app

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

CMD cd /app && node app.js
