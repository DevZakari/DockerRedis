import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import request from 'request';
import redis from 'redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();
app.use(express.json())
app.use(express.static(__dirname + '/public')); 
app.use(express.urlencoded({ extended: true }))
var port = 2000; 


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




app.post('/submit', async(req, res) => {

    var data = req.body;
    const cli = await client();
    cli.set("todo",data.todo);
    

    request.post('http://c_redis:5000/submit',async(err,resp,body) => {
        if(err){
            res.send(err);
        }else {
            
            const rec= await cli.get("todo");
            res.send(body);
        }
    })

})

app.listen(port, () => {
    console.log('listening for requests on port 2000')
  })







