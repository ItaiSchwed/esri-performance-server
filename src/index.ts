import {ReplaySubject} from "rxjs";
import {map} from "rxjs/operators";
import {Cycle} from "./cycle";
import {Generator} from "./generator";
import {Selenium} from "./selenium";
import {CyclesDb} from "./db/cycles.db";
import {RestServers} from "./servers/rest";
import {SocketServers} from "./servers/socket";
import {GLOBALS} from "./GLOBALS";

(async () => {
    const cyclesDb = new CyclesDb();
    cyclesDb.reset();
    const generator = new Generator();
    generator.addRandomPoints();
    const restServers = new RestServers();
    const socketServers = new SocketServers();
    const plotRestServer = restServers.runPlotServer(cyclesDb);
    const plotSocketServer = socketServers.runPlotServer(cyclesDb);
    const appRestServer = restServers.runAppServer();
    const selenium = await Selenium.create();

    for await(let i of Array(GLOBALS.CYCLES_COUNT).keys()) {
        const cycle = new Cycle(cyclesDb.cycle(+i), appRestServer.time$);
        await selenium.run(cycle);
    }
    // appRestServer.close();
    selenium.stop();
})();
