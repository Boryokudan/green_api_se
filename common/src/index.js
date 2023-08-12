const express = require("express");
const axios = require("axios");
const amqplib = require("amqplib");
const bodyParser = require("body-parser");

module.exports = {
    express: express,
    axios: axios,
    amqplib: amqplib,
    bodyParser: bodyParser
};