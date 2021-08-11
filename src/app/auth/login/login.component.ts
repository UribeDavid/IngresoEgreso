import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';
import { isLoading, stopLoading } from 'src/app/shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  isLoading: boolean = false;
  isLoadingSubscription: Subscription;

  constructor( private formBuilder: FormBuilder,
               private store: Store<AppState>,
               private router: Router,
               private _authService: AuthService) {
    this.isLoadingSubscription = this.store.select('ui').subscribe( ui => {
      this.isLoading = ui.isLoading;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {

    this.store.dispatch( isLoading() );

    /* Swal.fire({
      title: 'Cargando...',
      text: '',
      didOpen: () => {
        Swal.showLoading()
      }
    }); */

    const { email, password } = this.loginForm.value;
    this._authService.loginUsuario(email, password)
        .then( result => {
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
