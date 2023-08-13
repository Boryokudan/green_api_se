const common = require("../../common");
const config = require("../../common/config/config");
const AmqpConnection = require("../../common/src/amqp_connection");

class ResponseConsumer {

    channel;

    async initializeChannel() {
        const connection = await AmqpConnection.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async getResponse() {
        return new Promise((resolve, reject) => {
            if (!this.channel) {
                this.initializeChannel()
                    .then(() => this.consumeResponseQueue(resolve, reject))
                    .catch(reject);
            } else {
                this.consumeResponseQueue(resolve, reject);
            }
        });
    }
    
    async consumeResponseQueue(resolve, reject) {
        const responseQueue = config.rabbitMQ.responseQueueName;
    
        this.channel.consume(responseQueue, async (message) => {
            const data = JSON.parse(message.content);
            // console.log(`${new Date} Received "${data.action}" response from queue "${responseQueue}" with correlation id: ${correlationId}.`);
            this.channel.ack(message);
            await resolve(data);
        });
    }
}
module.exports = ResponseConsumer;