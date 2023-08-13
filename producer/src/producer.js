const common = require("../../common");
const config = require("../../common/config/config");
const AmqpConnection = require('../../common/src/amqp_connection');
const amqp = common.amqplib;

class Producer {

    channel;

    async initializeChannel() {
        const connection = await AmqpConnection.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(message) {
        if (!this.channel) {
            await this.initializeChannel();
        }
        const requestQueue = config.rabbitMQ.requestQueueName;
        const responseQueue = config.rabbitMQ.responseQueueName;

        await this.channel.assertQueue(requestQueue);
        await this.channel.assertQueue(responseQueue);

        await this.channel.sendToQueue(requestQueue, Buffer.from(JSON.stringify(message), {
            replyTo: responseQueue
        })
        );

        console.log(`${new Date} Sent "${message.action}" request to queue "${requestQueue}".`);
    }

    async getResponse() {
        if (!this.responseQueue) {
            await this.initializeResponseQueue();
        }
        return new Promise((resolve, reject) => {
            if (!this.responseQueue) {
                reject(new Error("Response queue not initialized."));
                return;
            }

            this.channel.consume(this.responseQueue.queue, (msg) => {
                try {
                    const data = JSON.parse(msg.content);
                    this.channel.ack(msg);
                    resolve(data);
                } catch (err) {
                    console.error(err);
                    reject(err);
                }
            });
        });
    }

    async generateId() {
        return Date.now().toString;
    }

    // WARNING: CREATES MULTIPLE CONSUMERS!
    // async getResponse() {
    //     return new Promise(async (resolve, reject) => {
    //         const exchangeName = config.rabbitMQ.responseExchangeName;
    //         this.channel.assertExchange(exchangeName, "direct");
    //         const responseQueue = await this.channel.assertQueue("InfoResponseQueue");
    
    //         this.channel.consume(responseQueue.queue, (msg) => {
    //             try {
    //                 const data = JSON.parse(msg.content);
    //                 console.log(data);
    //                 resolve(data);
    //             } catch(err) {
    //                 console.error(err);
    //                 reject(err);
    //             } finally {
    //                 this.channel.ack(msg);
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