import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubscription: Subscription;
  ingresosSubscription: Subscription;

  constructor( private store: Store<AppState>,
               private _ingresoEgresoService: IngresoEgresoService ) { 
    this.userSubscription = this.store.select('user')
      .pipe(
        filter( auth => auth.user != null )
      )
      .subscribe( ({user}) => {
        this.ingresosSubscription = this._ingresoEgresoService.initIngresosEgresosListener( user.uid )
          .subscribe( infresosEgresosFB => {
            this.store.dispatch( setItems({ items: infresosEgresosFB }) )
          });
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.ingresosSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

}
