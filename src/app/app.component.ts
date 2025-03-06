import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {FireAuthService} from './services/fireauth.service';
import {NgIf} from '@angular/common';
import {NzDropDownDirective, NzDropdownMenuComponent} from 'ng-zorro-antd/dropdown';
import {NzAvatarComponent} from 'ng-zorro-antd/avatar';
import {NzDividerComponent} from 'ng-zorro-antd/divider';
import {NzColDirective, NzRowDirective} from 'ng-zorro-antd/grid';
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, NgIf, NzDropDownDirective, NzAvatarComponent, NzDividerComponent, NzDropdownMenuComponent, NzRowDirective, NzColDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isAuthenticated:any;
  isCollapsed: boolean = false;
  constructor(
    private authService: FireAuthService,
    private router: Router ) {

  }

  ngOnInit() {
    this.isAuthenticated =  localStorage.getItem('firebase_user');
  }

  onLogOut() {
    this.authService.signOut().then(r => {
      this.router.navigate(['/sign-in']);
    })
  }
}
