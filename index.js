'use strict';

const Classes = {
    get Messaging() {
        return require('./src/messaging').Messaging;
    }
};

module.exports = Classes;
