import { Component, OnDestroy } from '@angular/core';
import { QueryParamBuilder, QueryParamGroup } from '@ngqp/core';
import { BehaviorSubject, Observable, of, Subject, combineLatest } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css']
})
export class FilterListComponent implements OnDestroy {
  protected ngUnsubscribe = new Subject();
  readonly refreshToken$ = new BehaviorSubject(undefined);

  valuesUnfiltered$: Observable<string[]>;
  values$: Observable<string[]>;

  paramGroup: QueryParamGroup;
  paramGroupValues$: Observable<Record<string, any>>;

  private fakeData = [
    'abc',
    'def',
    'abc 123',
    '123 def',
  ];

  constructor(private queryParamBuilder: QueryParamBuilder) {
    this.paramGroup = queryParamBuilder.group({
      quickSearch: queryParamBuilder.stringParam('q', { emptyOn: '' }),
    });

    this.paramGroupValues$ = this.paramGroup.valueChanges.pipe(
      startWith(this.paramGroup.value),
      takeUntil(this.ngUnsubscribe)
    );

    this.valuesUnfiltered$ = this.refreshToken$.pipe(
      switchMap(() => {
        return of(this.fakeData);
      }),
      takeUntil(this.ngUnsubscribe)
    );

    this.values$ = combineLatest([this.valuesUnfiltered$, this.paramGroupValues$]).pipe(
      map(([valuesUnfiltered, { quickSearch }]) => {
        if (quickSearch === null) {
          console.error('quickSearch is null, but should be initial value instead!');
          quickSearch = '';
        }
        return valuesUnfiltered.filter((value) => value.toLowerCase().includes(quickSearch.toLowerCase()));
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  refresh(): void {
    this.refreshToken$.next(undefined);
  }
}
