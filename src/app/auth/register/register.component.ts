import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor( private formBuilder: FormBuilder,
               private _authService: AuthService,
               private router: Router) { }

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
    
    Swal.fire({
      title: 'Cargando...',
      text: '',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    
    const { nombre, correo, password } = this.registroForm.value;

    this._authService.crearUsuario(nombre, correo, password)
        .then( credenciales => {
          console.log(credenciales)
          this.router.navigate(['/']);
          Swal.close();
        })
        .catch( err => {
          console.log(err)
          Swal.fire('¡Error!', err.message, 'error');
        });
  }

}
