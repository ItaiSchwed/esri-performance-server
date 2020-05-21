import {combineLatest, ReplaySubject, Subject} from "rxjs";
import {map, tap} from "rxjs/operators";
import {EntityExecution} from "./models/entity-execution.model";
import {GLOBALS} from "./GLOBALS";
import {CyclesDb} from "./db/cycles.db";
import {TimeStamp} from "./models/time-stamp.model";

export class Cycle {
    private start$ = new ReplaySubject<number>(1);
    private readonly entitiesCount: number;
    private counter = 0;

    constructor(private cycleDb, timesStamps$: Subject<TimeStamp>, entitiesCount?: number) {
        if (!GLOBALS.RANDOMIZE_ENTITIES_COUNT && !entitiesCount) {
            throw new Error('entitiesCount should be set');
        } else if (GLOBALS.RANDOMIZE_ENTITIES_COUNT) {
            entitiesCount = GLOBALS.ENTITIES_COUNT;
        }
        this.entitiesCount = entitiesCount;
        const subscription = combineLatest([this.start$, timesStamps$]).pipe(
            map(startStop => new EntityExecution(
                startStop[1].id,
                this.counter++,
                startStop[1].timeStamp - startStop[0])),
            tap(() => {
                if (this.entitiesCount === this.counter) {
                    this.start$.complete()
                }
            }))
            .subscribe(entityExecution => this.cycleDb.add(entityExecution));
        this.onComplete(() => subscription.unsubscribe());
    }

    start() {
        this.start$.next(Date.now());
    }

    get() {
        return this.cycleDb.get();
    }

    onComplete(callback: () => void) {
        this.start$.subscribe({complete: callback});
    }
}
