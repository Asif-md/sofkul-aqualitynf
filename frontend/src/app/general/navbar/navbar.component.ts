
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef}  from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Observable } from 'rxjs/Observable';
//import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit,  OnDestroy {
  user: Object;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private changeDetectorRef : ChangeDetectorRef
 //   private subscription: ISubscription
  ) { }

  ngOnDestroy() {
 // this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(navbar => {
      this.user = navbar.user;
      
    },
    err => {
      console.log(err);
      return false;
    });
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('you are logged out, redirecting to login page', {
      cssClass: 'alert-success', timeout: 5000
    });
    this.router.navigateByUrl('login');
    return true;
  }

}
