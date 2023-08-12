const common = require("../../common");
const config = require("../../common/config/config");
const amqp = common.amqplib;

async function consumeMessages() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();
    const exchangeName = config.rabbitMQ.requestExchangeName;

    await channel.assertExchange(exchangeName, "direct");

    const q = await channel.assertQueue("InfoQueue");
    await channel.bindQueue(q.queue, exchangeName, "Info");

    channel.consume(q.queue, (msg) => {
        const data = JSON.parse(msg.content);
        console.log(data);
        channel.ack(msg);
    });
}

consumeMessages();