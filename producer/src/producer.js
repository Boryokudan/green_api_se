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

        console.log(`The request ${message.action} is sent to exchange "${exchangeName}".`)
    }

    async getResponse() {
        const exchangeName = config.rabbitMQ.responseExchangeName;
        await this.channel.assertExchange(exchangeName, "direct");
        const responseQueue = await this.channel.assertQueue("InfoResponseQueue");

        this.channel.consume(responseQueue.queue, (msg) => {
            try {
                const data = JSON.parse(msg.content);
                console.log(data);
            } catch(err) {
                console.error(err);
            } finally {
                this.channel.ack(msg);
            }
        });
    }
}

module.exports = Producer;