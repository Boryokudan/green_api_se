const common = require("../../common");
const config = require("../../common/config/config");
const amqp = common.amqplib;

class Producer {
    channel;

    async createChannel() {
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message) {
        if (!this.channel) {
            await this.createChannel();
        }

        const exchangeName = config.rabbitMQ.requestExchangeName;
        await this.channel.assertExchange(exchangeName, "direct");

        await this.channel.publish(
            exchangeName, 
            routingKey,
            Buffer.from(JSON.stringify(message))
        );

        console.log(`The message ${message} is sent to exchange "${exchangeName}".`)
    }
}

module.exports = Producer;