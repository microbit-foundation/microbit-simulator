#!/bin/sh

if [ -z "$INIT" ]
then
    # Build
    export PATH=$PATH:/emsdk/emscripten/1.38.21
    cd src
    ./cli.js micropython
    chown -R $UID /src
else
    # Initialise
    cd src
    npm install
    echo "[trusted]" > /etc/mercurial/hgrc
    echo "users = $UID" >> /etc/mercurial/hgrc
    mbed deploy
    chown -R $UID /src
fi