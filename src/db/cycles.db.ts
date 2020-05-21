import {Entity} from "../models/entity.model";
import {DB} from "./DB";
import {v4 as uuid} from "uuid";
import {EntityExecution} from "../models/entity-execution.model";
import {ReplaySubject} from "rxjs";

export class CyclesDb {
    private entry = 'cycles';
    private db = DB(this.entry);
    count$ = new ReplaySubject<number[]>(1);

    constructor() {
    }

    reset() {
        this.db.set(this.entry, []).write();
    }

    cycle(cycleCount: number, cycleId?: string) {
        const cycleById = this.db.get(this.entry).find({cycleId: cycleId}).value();
        if (!cycleById) {
            const cycleByCount = this.db.get(this.entry).find({cycleCount: cycleCount}).value();
            cycleId = cycleByCount? cycleByCount.cycleId: uuid();
            if (!cycleByCount) {
                this.addCycle(cycleCount, cycleId);
            }
        }
        return new CyclesDb.CycleDb(this.db.get(this.entry).find({cycleId: cycleId}));
    }

    private addCycle(cycleCount: number, cycleId: string) {
        this.db.get(this.entry).push({cycleCount, cycleId, times: []}).write();
        this.count$.next(this.getCyclesCounts());
    }

    getCyclesCounts(): number[] {
        return this.db.get(this.entry).map('cycleCount').value();
    }

    private static CycleDb = class {

        constructor(private entry) { }

        public get() {
            return this.entry.value();
        }

        public add(entity: EntityExecution) {
            this.getTimes().push(entity).write();
        }

        public getTimes() {
            return this.entry.get('times');
        }
    }
}
