import {CyclesDb} from "../db/cycles.db";
import * as express from 'express';
import * as httpServer from 'http';
import * as socketio from 'socket.io';
import * as cors from 'cors';

const app = express();
app.use(cors());
const http = new httpServer.Server(app);
const io = socketio(http);

export class SocketServers {

    public runPlotServer(cyclesDb) {
        io.on("connection",
            socket => cyclesDb.count$.subscribe(
                cyclescounts => {
                    io.emit('count', cyclescounts);
                }));
        return http.listen(4000);
    }
}
