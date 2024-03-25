import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PuppiesStoreStateModel } from '../models/PuppiesStoreState.model';
import { Puppy } from './puppy.model';

@Injectable({ providedIn: 'root' })
export class PuppiesStoreService {
    private state: PuppiesStoreStateModel = {
        puppiesList: [],
    };

    private readonly store = new BehaviorSubject<PuppiesStoreStateModel>(this.state);
    private readonly state$ = this.store.asObservable();

    // State exposed observables for components
    puppiesList$: Observable<[]> = this.state$.pipe(
        map((state: HistoryReportState) => state.historyInfos),
        distinctUntilChanged()
    );
    historyInfoPagination$: Observable<Pagination<RichPosition>> = this.state$.pipe(
        map((state: HistoryReportState) => state.historyInfoPagination),
        distinctUntilChanged()
    );
    historyFilter$: Observable<HistoryProximityFilter> = this.state$.pipe(
        map((state: HistoryReportState) => state.historyFilter),
        distinctUntilChanged()
    );
    historySort$: Observable<Sort> = this.state$.pipe(
        map((state: HistoryReportState) => state.sort),
        distinctUntilChanged()
    );

    private readonly _puppiesSource = new BehaviorSubject<Puppy[]>([]);

    // Exposed observable (read-only).
    readonly puppies$ = this._puppiesSource.asObservable();

    constructor() {}

    // Get last value without subscribing to the puppies$ observable (synchronously).
    getPuppies(): Puppy[] {
        return this._puppiesSource.getValue();
    }

    private _setPuppies(puppies: Puppy[]): void {
        this._puppiesSource.next(puppies);
    }

    addPuppy(puppy: Puppy): void {
        const puppies = [...this.getPuppies(), puppy];
        this._setPuppies(puppies);
    }

    removePuppy(puppy: Puppy): void {
        const puppies = this.getPuppies().filter((p) => p.id !== puppy.id);
        this._setPuppies(puppies);
    }

    adoptPuppy(puppy: Puppy): void {
        const puppies = this.getPuppies().map((p) => (p.id === puppy.id ? new Puppy({ ...p, ...{ adopted: true } }) : p));
        this._setPuppies(puppies);
    }
}
