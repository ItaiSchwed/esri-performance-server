import {Cycle} from "../cycle";
import {EntitiesDb} from "../db/entities.db";
import {CyclesDb} from "../db/cycles.db";
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cors from 'cors';
import {Subject} from "rxjs";
import {TimeStamp} from "../models/time-stamp.model";

export class RestServers {
    public runAppServer() {
        const time$ = new Subject<TimeStamp>();
        const app = express();
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser());
        app.use(cors());

        const server = app.listen(3000, () => {
            console.log("App server running on port 3000");
        });

        app.get('/entities/all', (req, res) => {
            res.json(new EntitiesDb().get());
        });

        app.post('/entities/time', (req, res) => {
            time$.next(req.body);
            res.status(200).json({status: "ok"});
        });

        return {close: () => server.close(), time$}
    };

    public runPlotServer(cyclesDb: CyclesDb) {
        const app = express();
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser());
        app.use(cors());

        const server = app.listen(3001, () => {
            console.log("Plot server running on port 3001");
        });

        app.get('/cycles/:cycleCount', (req, res) => {
            if (isNaN(+req.params.cycleCount)) {
                res.status(422).json('cycleCount should be a number');
                return;
            }
            res.json(cyclesDb.cycle(+req.params.cycleCount).getTimes());
        });

        return {close: () => server.close()};
    }
}
