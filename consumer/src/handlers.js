const common = require("../../common");
const express = common.express;
const axios = common.axios;

async function processGetSettings(channel, responseQueue, data, correlationId) {
    const idInstance = data.idInstance;
    const apiTokenInstance = data.apiTokenInstance;

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`;

    axios.get(apiUrl)
        .then(response => {
            channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(response.data)), {
                correlationId: correlationId
            });
        })
        .catch(err => {
            console.error("Error: ", err);
        });
};

async function processGetState(channel, responseQueue, data, correlationId) {
    const idInstance = data.idInstance;
    const apiTokenInstance = data.apiTokenInstance;

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;

    axios.get(apiUrl)
        .then(response => {
            channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(response.data)), {
                correlationId: correlationId
            });
        })
        .catch(err => {
            console.error("Error: ", err);
        });
};

async function processSendMessage(channel, responseQueue, data, correlationId) {
    const idInstance = data.idInstance;
    const apiTokenInstance = data.apiTokenInstance;

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const postData = {
        chatId: data.chatId,
        message: data.message
    };

    axios.post(apiUrl, postData, {
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then(response => {
            channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(response.data)), {
                correlationId: correlationId
            });
        })
        .catch(err => {
            console.error("Error: ", err);
        });
};

async function processSendFileByUrl(channel, responseQueue, data, correlationId) {
    const idInstance = data.idInstance;
    const apiTokenInstance = data.apiTokenInstance;

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/sendFileByUrl/${apiTokenInstance}`;

    const postData = {
        chatId: data.chatId,
        urlFile: data.urlFile,
        fileName: data.fileName
    };

    axios.post(apiUrl, postData, {
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then(response => {
            channel.sendToQueue(responseQueue, Buffer.from(JSON.stringify(response.data)), {
                correlationId: correlationId
            });
        })
        .catch(err => {
            console.error("Error: ", err);
        });
};

module.exports = {
    processGetSettings,
    processGetState,
    processSendMessage,
    processSendFileByUrl
};