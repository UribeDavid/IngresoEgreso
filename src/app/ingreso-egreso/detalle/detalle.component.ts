import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosEgresosSubscription: Subscription;

  constructor( private store: Store<AppStateWithIngreso>,
               private _ingresoEgresoService: IngresoEgresoService ) { 
    this.ingresosEgresosSubscription = this.store.select('ingresosEgresos')
      .subscribe( ({items}) => this.ingresosEgresos = items);
  }

  ngOnInit(): void {
  }

  borrar(uid:string) {
    this._ingresoEgresoService.borrarIngresoEgreso(uid)
        .then( () => Swal.fire( '¡Acción realizada!', 'Borrado correctamente', 'success' ))
        .catch( err => Swal.fire( '¡Error!', err.message, 'error' ));
  }

  ngOnDestroy() {
    if ( this.ingresosEgresosSubscription ) this.ingresosEgresosSubscription.unsubscribe();
  }

}
