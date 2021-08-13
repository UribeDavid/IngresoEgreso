import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0;
  egresos: number = 0;
  totalEgresos: number = 0;
  totalIngresos: number = 0;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [];
  public doughnutChartType: ChartType = 'doughnut';


  constructor( private store: Store<AppState> ) { 
    this.store.select('ingresosEgresos').subscribe( ({items}) => {
      this.generarEstadistica(items);
    });
  }

  ngOnInit(): void {
  }

  generarEstadistica(items: IngresoEgreso[]) {
    const result = items.reduce( (acc, cur): {
      ingresos
      egresos
      totalEgresos
      totalIngresos
    } => {
      return {
        ingresos: acc.ingresos += cur.tipo === 'ingreso' ? 1 : 0,
        egresos: acc.egresos += cur.tipo === 'egreso' ? 1 : 0,
        totalIngresos: acc.totalIngresos += cur.tipo === 'ingreso' ? cur.monto : 0,
        totalEgresos: acc.totalEgresos += cur.tipo === 'egreso' ? cur.monto : 0
      }
    }, {ingresos: 0, egresos: 0, totalEgresos: 0, totalIngresos: 0});
    Object.keys(result).forEach( key => {
      this[key] = result[key];
    });

    this.doughnutChartData = [ [this.totalIngresos, this.totalEgresos] ];
  }

}
