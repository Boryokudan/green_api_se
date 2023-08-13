const common = require("../../common");
const config = require("../../common/config/config");
const AmqpConnection = require("../../common/src/amqp_connection");
const handlers = require("./handlers");
const amqp = common.amqplib;

async function consumeMessages() {
    const connection = await AmqpConnection.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const requestQueue = config.rabbitMQ.requestQueueName;
    const responseQueue = config.rabbitMQ.responseQueueName;

    await channel.assertQueue(requestQueue);
    await channel.assertQueue(responseQueue);

    channel.consume(requestQueue, (message) => {
        const data = JSON.parse(message.content);
        const correlationId = message.properties.correlationId;
        
        try {
            switch(data.action) {
                case "getSettings": handlers.processGetSettings(channel, responseQueue, data, correlationId);
                    break;
                case "getState": handlers.processGetState(channel, responseQueue, data, correlationId);
                    break;
                case "sendMessage": handlers.processSendMessage(channel, responseQueue, data, correlationId);
                    break;
                case "sendFileByUrl": handlers.processSendFileByUrl(channel, responseQueue, data, correlationId);
                    break;
            }
        } catch(err) {
            console.error("Error: ", err);
        } finally {
            console.log(`${new Date} Processed "${data.action}" request from queue "${requestQueue}".`)
            channel.ack(message);
        }
    });
}

consumeMessages();