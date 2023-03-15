const redis = require("redis");
const express = require("express");
const cors = require("cors");
const app = express();

// trust app to app :
app.use(cors());
app.options("*", cors());

// midleware :
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;



async function client() {
    const client = redis.createClient({
        url: "redis://redis:6379",
        socket:{
            connectTimeout: 60000,
				keepAlive: 60000,
        }
      });

    client.on('error', err => console.error('client error', err));
    client.on('connect', () => console.log('client is connect'));
    client.on('reconnecting', () => console.log('client is reconnecting'));
    client.on('ready', () => console.log('client is ready'));

    await client.connect();

    return client;
}





function formatOutput(todo) {
  return `${todo} has been inserted on Redis Cache`;
}

app.post(`/submit`, async (req, res) => {
 

    const cli = await client();
    const rec= await cli.get("todo");

    return res.send(formatOutput(rec));

});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
