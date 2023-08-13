const common = require("../../common");
const express = common.express;
const path = require("path");
const bodyParser = common.bodyParser;
const Producer = require("./producer");
const ResponseConsumer = require("./response_consumer");

const app = express();
app.use(bodyParser.json("application/json"));
app.use(express.static(path.join(__dirname, "../public")));

const producer = new Producer();
const responseConsumer = new ResponseConsumer();
const port = 3000;

app.get("/settings", async (req, res) => {
    const idInstance = req.query.idInstance;
    const apiTokenInstance = req.query.apiTokenInstance;

    const data = {
	    action: "getSettings",
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance
    };
    
    await producer.publishMessage(data);
    const resData = await responseConsumer.getResponse();
    res.send(resData);
});

app.get("/state", async (req, res) => {
    const idInstance = req.query.idInstance;
    const apiTokenInstance = req.query.apiTokenInstance;

    const data = {
	    action: "getState",
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance
    };
    
    await producer.publishMessage(data);
    const resData = await responseConsumer.getResponse();
    res.send(resData);
});

app.post("/sendMessage", async (req, res) => {
    const idInstance = req.query.idInstance;
    const apiTokenInstance = req.query.apiTokenInstance;

    const data = {
	    action: "sendMessage",
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance,
        chatId: req.body.chatId,
        message: req.body.message
    };
    
    await producer.publishMessage(data);
    const resData = await responseConsumer.getResponse();
    res.send(resData);
});

app.post("/sendFileByUrl", async (req, res) => {
    const idInstance = req.query.idInstance;
    const apiTokenInstance = req.query.apiTokenInstance;

    const data = {
	    action: "sendFileByUrl",
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance,
        chatId: req.body.chatId,
        urlFile: req.body.urlFile,
        fileName: req.body.fileName
    };
    
    await producer.publishMessage(data);
    const resData = await responseConsumer.getResponse();
    res.send(resData);
});

app.listen(port, () => {
    console.log(`Producer app is listening on port ${port}.`);
});