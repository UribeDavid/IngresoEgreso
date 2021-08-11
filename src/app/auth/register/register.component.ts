import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

import { AuthService } from 'src/app/services/auth.service';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  registroForm: FormGroup;
  isLoading: boolean = false;
  isLoadingSubscription: Subscription;

  constructor( private formBuilder: FormBuilder,
               private store: Store<AppState>,
               private _authService: AuthService,
               private router: Router) { 
    this.isLoadingSubscription = this.store.select('ui').subscribe( ui => {
      this.isLoading = ui.isLoading;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registroForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  crearUsuario() {

    if ( this.registroForm.invalid ) return;

    this.store.dispatch( isLoading() );
    
    /* Swal.fire({
      title: 'Cargando...',
      text: '',
      didOpen: () => {
        Swal.showLoading()
      }
    }); */
    
    const { nombre, correo, password } = this.registroForm.value;

    this._authService.crearUsuario(nombre, correo, password)
        .then( credenciales => {
          console.log(credenciales)
          this.store.dispatch( stopLoading() );
          this.router.navigate(['/']);
          // Swal.close();
        })
        .catch( err => {
          console.log(err)
          this.store.dispatch( stopLoading() );
          Swal.fire('¡Error!', err.message, 'error');
        });
  }

  ngOnDestroy() {
    if (this.isLoadingSubscription) this.isLoadingSubscription.unsubscribe();
  }

}
