const common = require("../../common");
const express = common.express;
const axios = common.axios;

async function processGetSettings(data, channel, responseExchangeName) {
    const idInstance = data.idInstance;
    const apiTokenInstance = data.apiTokenInstance;

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`;

    axios.get(apiUrl)
        .then(response => {
            channel.publish(
            responseExchangeName,
            "Info",
            Buffer.from(JSON.stringify(response.data)));
        })
        .catch(err => {
            console.error("Error: ", err);
        });
};

async function processGetState(data, channel, responseExchangeName) {
    const idInstance = data.idInstance;
    const apiTokenInstance = data.apiTokenInstance;

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`;

    axios.get(apiUrl)
        .then(response => {
            channel.publish(
            responseExchangeName,
            "Info",
            Buffer.from(JSON.stringify(response.data)));
        })
        .catch(err => {
            console.error("Error: ", err);
        });
};

async function processSendMessage(data, channel, responseExchangeName) {
    const idInstance = data.idInstance;
    const apiTokenInstance = data.apiTokenInstance;

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const postData = {
        chatId: data.phoneNumber,
        message: data.messageContent
    };

    axios.post(apiUrl, postData, {
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then(response => {
            channel.publish(
            responseExchangeName,
            "Info",
            Buffer.from(JSON.stringify(response.data)));
        })
        .catch(err => {
            console.error("Error: ", err);
        });
};

async function processSendFileByUrl(data, channel, responseExchangeName) {
    const idInstance = data.idInstance;
    const apiTokenInstance = data.apiTokenInstance;

    const apiUrl = `https://api.green-api.com/waInstance${idInstance}/sendFileByUrl/${apiTokenInstance}`;

    const postData = {
        chatId: data.phoneNumber,
        urlFile: data.url,
        fileName: data.fileName
    };

    axios.post(apiUrl, postData, {
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then(response => {
            channel.publish(
            responseExchangeName,
            "Info",
            Buffer.from(JSON.stringify(response.data)));
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