'use strict';

function start() {
    if(process.argv[2] === '-i' || !process.argv[2]) {
        return require('./cli');
    }
}

start();