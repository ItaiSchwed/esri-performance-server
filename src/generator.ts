import {Entity} from "./models/entity.model";
import {DB} from './db/DB';
import {GLOBALS} from "./GLOBALS";
import { v4 as uuid } from 'uuid';
import {EntitiesDb} from "./db/entities.db";

export class Generator {
    private entitiesDb = new EntitiesDb();
    constructor() {
        if (GLOBALS.RESET_ENTITIES) {
            this.entitiesDb.reset();
        }
    }

    addRandomPoints(count?: number) {
        if (!GLOBALS.RANDOMIZE_ENTITIES_COUNT && !count) {
            throw new Error('count should be set');
        }
        else if (GLOBALS.RANDOMIZE_ENTITIES_COUNT) {
            count = GLOBALS.ENTITIES_COUNT - this.entitiesDb.getCount();
        }
        [...Array(count)].forEach(() => this.addPoint());
    }

    addPoint(longitude?: number, latitude?: number) {
        this.entitiesDb.add(
            new Entity(uuid(),
                longitude?? Math.random()*2 + 34,
                latitude?? Math.random()*2 + 31)
            );
    }
}
