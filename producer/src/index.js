const common = require("../../common");
const express = common.express;
const bodyParser = common.bodyParser;
const Producer = require("./producer");

const app = express();
app.use(bodyParser.json("application/json"));

const producer = new Producer();
const port = 3000;

app.get("/settings", async (req, res) => {
    const data = req.body;
    
    await producer.publishMessage(data.reqType, data);
    await producer.getResponse();

    res.send();
});

app.get("/state", async (req, res) => {
    const data = req.body;
    
    await producer.publishMessage(data.reqType, data);
    await producer.getResponse();
    
    res.send();
});

app.post("/sendMessage", async (req, res) => {
    const data = req.body;
    
    await producer.publishMessage(data.reqType, data);
    await producer.getResponse();
    
    res.send();
});

app.post("/sendFileByUrl", async (req, res) => {
    const data = req.body;
    
    await producer.publishMessage(data.reqType, data);
    await producer.getResponse();
    
    res.send();
});

app.listen(port, () => {
    console.log(`Producer app listening on port ${port}`);
});