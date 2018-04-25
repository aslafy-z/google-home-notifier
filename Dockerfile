FROM node:8

WORKDIR /app
COPY . ./

RUN apt-get update -yy && \
    apt-get install -yy \
        avahi-daemon avahi-discover avahi-utils libnss-mdns \
        libavahi-compat-libdnssd-dev
RUN npm i

EXPOSE 8080
CMD ["./start.sh"]
