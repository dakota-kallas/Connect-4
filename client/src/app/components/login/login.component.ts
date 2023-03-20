import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Input() username?: string;
  @Input() password?: string;
  errorOccured: boolean = false;
  errorMsg: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.username = '';
    this.password = '';
  }

  login() {
    this.errorOccured = false;

    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe((user) => {
        if (typeof user === 'object' && 'email' in user && user.email) {
          this.username = '';
          this.password = '';
          this.router.navigateByUrl('home');
        } else if (typeof user === 'object' && 'msg' in user) {
          this.errorMsg = user.msg;
          this.errorOccured = true;
          this.password = '';
        }
      });
    }
  }
}
