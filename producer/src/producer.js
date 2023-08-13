const common = require("../../common");
const config = require("../../common/config/config");
const amqp = common.amqplib;

class Producer {
    channel;

    constructor() {
        this.responseQueue = null;
        this.initializeResponseQueue();
    }

    async createChannel() {
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async initializeResponseQueue() {
        if (!this.channel) {
            await this.createChannel();
        }
        const exchangeName = config.rabbitMQ.responseExchangeName;
        await this.channel.assertExchange(exchangeName, "direct");
        this.responseQueue = await this.channel.assertQueue("InfoResponseQueue");
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

        console.log(`${new Date} Sent "${message.action}" request to exchange "${exchangeName}".`);
    }

    async getResponse() {
        return new Promise(async (resolve, reject) => {
            if (!this.responseQueue) {
                reject(new Error("Response queue not initialized"));
                return;
            }

            this.channel.consume(this.responseQueue.queue, (msg) => {
                try {
                    const data = JSON.parse(msg.content);
                    this.channel.ack(msg);
                    resolve(data);
                } catch(err) {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    // async getResponse() {
    //     return new Promise(async (resolve, reject) => {
    //         const exchangeName = config.rabbitMQ.responseExchangeName;
    //         this.channel.assertExchange(exchangeName, "direct");
    //         const responseQueue = await this.channel.assertQueue("InfoResponseQueue");
    
    //         this.channel.consume(responseQueue.queue, (msg) => {
    //             try {
    //                 const data = JSON.parse(msg.content);
    //                 this.channel.ack(msg);
    //                 resolve(data);
    //             } catch(err) {
    //                 console.error(err);
    //                 reject(err);
    //             }
    //         });
    //     });
    // }

    // async getResponse() {
    //     const exchangeName = config.rabbitMQ.responseExchangeName;
    //     await this.channel.assertExchange(exchangeName, "direct");
    //     const responseQueue = await this.channel.assertQueue("InfoResponseQueue");

    //     this.channel.consume(responseQueue.queue, (msg) => {
    //         try {
    //             const data = JSON.parse(msg.content);
    //             console.log(data);
    //         } catch(err) {
    //             console.error(err);
    //         } finally {
    //             this.channel.ack(msg);
    //         }
    //     });
    // }
}

module.exports = Producer;