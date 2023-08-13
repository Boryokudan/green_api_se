const amqp = require('amqplib');
const config = require('../config/config');

class AmqpConnection {
    constructor() {
      this.connection = null;
    }
  
    async connect() {
      if (!this.connection) {
        this.connection = await amqp.connect(config.rabbitMQ.url);
      }
      return this.connection;
    }
  }
  
  module.exports = new AmqpConnection();