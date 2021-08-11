import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setUser, unsetUser } from '../auth/auth.actions';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor( public auth: AngularFireAuth,
               private store: Store<AppState>,
               public fireStore: AngularFirestore ) { }

  initAuthListener() {

    this.auth.authState.subscribe( fbUser => {
      if ( fbUser ) {
        this.userSubscription = this.fireStore.doc(`${ fbUser.uid }/usuario`).valueChanges().subscribe( (fsUser:any) => {
          const user = Usuario.fromFirebase(fsUser)
          this.store.dispatch( setUser({ user }));
        });
      } else {
        this.store.dispatch( unsetUser());
        if (this.userSubscription) this.userSubscription.unsubscribe();
      }
      // console.log(fbUser?.uid)
    });
  }

  crearUsuario(nombre:string, email:string, password:string) {
    
    return this.auth.createUserWithEmailAndPassword(email, password)
               .then( ({ user }) => {
                  const newUser = new Usuario( user.uid, nombre, email );
                  return this.fireStore.doc( `${user.uid}/usuario`)
                                       .set( {...newUser} )
               });
  }

  loginUsuario(email:string, password:string) {

    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser ? true : false )
    );
  }
}
