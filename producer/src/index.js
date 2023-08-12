const common = require("../../common");
const express = common.express;
const axios = common.axios;
const ampq = common.amqplib;
const bodyParser = common.bodyParser;
const Producer = require("./producer");

const app = express();
app.use(bodyParser.json("application/json"));

const producer = new Producer();
const port = 3000;

// const idInstance = "7103846835";
// const apiTokenInstance = "c3f52d0193c64979b46871ba218d4e318dceca7f61c046d49e";

app.get("/settings", async (req, res) => {
    const data = req.body;
    console.log(data);
    console.log(data.logType);
    
    await producer.publishMessage(data.logType, data);
    res.send();
});

// app.get("/settings", (req, res) => {
    
//     const apiUrl = `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`;

//     axios.get(apiUrl)
//         .then(response => {
//             // console.log(response.data);
//             res.json(response.data)
//         })
//         .catch(err => {
//             console.error(err);
//             res.sendStatus(500);
//         });
// });

app.listen(port, () => {
    console.log(`Producer app listening on port ${port}`);
});