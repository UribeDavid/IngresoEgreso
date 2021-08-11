import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private _authService: AuthService) { }

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

    Swal.fire({
      title: 'Cargando...',
      text: '',
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const { email, password } = this.loginForm.value;
    this._authService.loginUsuario(email, password)
        .then( result => {
          this.router.navigate(['/']);
          Swal.close();
        })
        .catch( err => {
          console.log(err)
          Swal.fire('¡Error!', err.message, 'error');
        });
  }

}
