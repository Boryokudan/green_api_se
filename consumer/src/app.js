const common = require("../../common");
const config = require("../../common/config/config");
const handlers = require("./handlers");
const amqp = common.amqplib;

async function consumeMessages() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const requestExchangeName = config.rabbitMQ.requestExchangeName;
    const responseExchangeName = config.rabbitMQ.responseExchangeName;

    await channel.assertExchange(requestExchangeName, "direct");
    await channel.assertExchange(responseExchangeName, "direct");

    const requestQueue = await channel.assertQueue("InfoRequestQueue");
    const responseQueue = await channel.assertQueue("InfoResponseQueue");

    await channel.bindQueue(requestQueue.queue, requestExchangeName, "Info");
    await channel.bindQueue(responseQueue.queue, responseExchangeName, "Info");

    channel.consume(requestQueue.queue, (msg) => {
        const data = JSON.parse(msg.content);
        
        try {
            switch(data.action) {
                case "getSettings": handlers.processGetSettings(data, channel, responseExchangeName);
                    break;
                case "getState": handlers.processGetState(data, channel, responseExchangeName);
                    break;
                case "sendMessage": handlers.processSendMessage(data, channel, responseExchangeName);
                    break;
                case "sendFileByUrl": handlers.processSendFileByUrl(data, channel, responseExchangeName);
                    break;
            }
        } catch(err) {
            console.error("Error: ", err);
        } finally {
            channel.ack(msg);
        }
    });
}

consumeMessages();