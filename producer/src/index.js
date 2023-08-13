const common = require("../../common");
const express = common.express;
const path = require("path");
const bodyParser = common.bodyParser;
const Producer = require("./producer");

const app = express();
app.use(bodyParser.json("application/json"));
app.use(express.static(path.join(__dirname, "../public")));

const producer = new Producer();
const port = 3000;

app.get("/settings", async (req, res) => {
    const idInstance = req.query.idInstance;
    const apiTokenInstance = req.query.apiTokenInstance;

    const data = {
        reqType: "Info",
	    action: "getSettings",
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance
    };
    
    await producer.publishMessage(data.reqType, data);
    const resData = await producer.getResponse();
    res.send(resData);
});

app.get("/state", async (req, res) => {
    const idInstance = req.query.idInstance;
    const apiTokenInstance = req.query.apiTokenInstance;

    const data = {
        reqType: "Info",
	    action: "getState",
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance
    };
    
    await producer.publishMessage(data.reqType, data);
    const resData = await producer.getResponse();
    res.send(resData);
});

//----------------------------------------------------------------------------------------------------------------------------------------

app.post("/sendMessage", async (req, res) => {
    const idInstance = req.query.idInstance;
    const apiTokenInstance = req.query.apiTokenInstance;

    const data = {
        reqType: "Info",
	    action: "sendMessage",
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance,
        chatId: req.body.chatId,
        message: req.body.message
    };
    
    await producer.publishMessage(data.reqType, data);
    const resData = await producer.getResponse();
    res.send(resData);
});

app.post("/sendFileByUrl", async (req, res) => {
    const idInstance = req.query.idInstance;
    const apiTokenInstance = req.query.apiTokenInstance;

    const data = {
        reqType: "Info",
	    action: "sendFileByUrl",
        idInstance: idInstance,
        apiTokenInstance: apiTokenInstance,
        chatId: req.body.chatId,
        urlFile: req.body.urlFile,
        fileName: req.body.fileName
    };
    
    await producer.publishMessage(data.reqType, data);
    const resData = await producer.getResponse();
    res.send(resData);
});

app.listen(port, () => {
    console.log(`Producer app is listening on port ${port}.`);
});