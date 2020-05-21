import {Entity} from "../models/entity.model";
import {DB} from "./DB";

export class EntitiesDb {
    private entry = 'entities';
    private db = DB(this.entry);

    constructor() { }

    reset() {
        this.db.set(this.entry, []).write();
    }

    get() {
        return this.db.get(this.entry).value();
    }

    add(entity: Entity) {
        this.db.get(this.entry).push(entity).write();
    }

    getCount() {
        return this.db.get(this.entry).size().value();
    }
}
