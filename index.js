import { config } from 'dotenv';
config()
import { createServer } from 'http';
import startWSS from './sockets.js';
import app from "./pipeline.js"

const port = 8081;
const host = "localhost";

const server = createServer(app);

async function start() {
    try{
        server.listen(port,host, () => {
         console.log(`Server runs at http://${host}:${port}`);
        });
        startWSS(server);

    }catch (e) {
        console.log(e);
    }
}

start()



