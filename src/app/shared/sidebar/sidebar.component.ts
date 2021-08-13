import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  userName: string = '';
  nameSubscription: Subscription;

  constructor(private router: Router,
              private _authService: AuthService,
              private store: Store<AppState>) { 
    this.nameSubscription = this.store.select('user')
      .pipe(
        filter( ({user}) => user != null)
      )
      .subscribe( ({user}) => {
      this.userName = user?.nombre;
    });
  }

  ngOnInit(): void {
  }

  logut() {
    this._authService.logout()
      .then( () => {
        this.router.navigate(['/login']);
      })
      .catch();
  }

  ngOnDestroy() {
    if ( this.nameSubscription ) this.nameSubscription.unsubscribe();
  }

}
