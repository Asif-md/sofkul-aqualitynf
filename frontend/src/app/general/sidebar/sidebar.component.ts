import {Component, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: Object;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(dashboard => {
      this.user = dashboard.user;
    },
    err => {
      console.log(err);
      return false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changing');
  }

}
