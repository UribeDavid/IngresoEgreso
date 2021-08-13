import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { isLoading, stopLoading } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  isIngreso: boolean = true;
  isLoading: boolean = false;
  isLoadingSubscription: Subscription;

  constructor( private formBuilder: FormBuilder,
               private _ingresoEgresoService: IngresoEgresoService,
               private store: Store<AppState> ) { 
    this.isLoadingSubscription = this.store.select('ui').subscribe( ui => {
      this.isLoading = ui.isLoading;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.ingresoForm = this.formBuilder.group({
      descripcion: [null, Validators.required],
      monto: [null, Validators.required],
    });
  }

  guardar() {
    
    if ( this.ingresoForm.invalid ) return;

    this.store.dispatch( isLoading() );

    const { descripcion, monto } = this.ingresoForm.value;
    const tipo = this.isIngreso ? 'ingreso' : 'egreso';
    const ingresoEgreso = new IngresoEgreso( descripcion, monto, tipo );
    this._ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
        .then( () => {
          this.ingresoForm.reset();
          this.store.dispatch( stopLoading() );
          Swal.fire('¡Acción realizada!', 'Ingreso/Egreso guardado correctamente', 'success');
        })
        .catch(err => {
          this.store.dispatch( stopLoading() );
          Swal.fire('¡Error!', err.message, 'error');
        });

  }

  ngOnDestroy() {
    if ( this.isLoadingSubscription ) this.isLoadingSubscription.unsubscribe();
  }

}
