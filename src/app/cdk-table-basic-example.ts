import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = new Array(100).fill({
  position: 1,
  name: 'Hydrogen',
  weight: 1.0079,
  symbol: 'H',
  symbol1: 'H',
  symbol2: 'H',
  symbol3: 'H'
});

/**
 * @title Basic CDK data-table
 */
@Component({
  selector: 'cdk-table-basic-example',
  styleUrls: ['cdk-table-basic-example.css'],
  templateUrl: 'cdk-table-basic-example.html'
})
export class CdkTableBasicExample implements OnInit {
  ngOnInit(): void {
    this.symbols = new Array(50).fill(50).map((_, i) => {
      return 'symbol' + i;
    });

    this.displayedColumns.push(...this.symbols);
  }
  symbols: string[];
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = new ExampleDataSource();
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<PeriodicElement> {
  /** Stream of data that is provided to the table. */
  data = new BehaviorSubject<PeriodicElement[]>(ELEMENT_DATA);

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<PeriodicElement[]> {
    return this.data;
  }

  disconnect() {}
}

/**  Copyright 2021 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
