import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzDropdownMenuComponent, NzDropDownDirective} from 'ng-zorro-antd/dropdown';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzDividerComponent} from 'ng-zorro-antd/divider';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NgIf} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NgIf,
    NzDropDownDirective,
    NzAvatarComponent,
    NzDividerComponent,
    NzDropdownMenuComponent,
    NzRowDirective,
    NzColDirective
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;
  isCollapsed: boolean = false;
  authenticateEmail: string | null = ''

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    const token = localStorage.getItem('firebase_token');
    this.authenticateEmail = localStorage.getItem('displayName');
    this.isAuthenticated = !!token;
  }

  onLogOut() {
    localStorage.removeItem('firebase_token');
    localStorage.removeItem('firebase_refresh_token');
    localStorage.removeItem('firebase_token_expiry');
    localStorage.removeItem('firebase_user');
    localStorage.removeItem('displayName');
    this.router.navigate(['/sign-in']);
  }

}
