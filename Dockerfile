FROM ubuntu:18.04
COPY init.sh .
COPY build-image.sh .
COPY build.sh .
RUN sh build-image.sh
CMD sh build.sh