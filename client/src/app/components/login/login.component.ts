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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.username = 'dakota@test.com';
    this.password = '123';
  }

  login() {
    if (this.username && this.password) {
      this.authService.login(this.username, this.password).subscribe((user) => {
        if (user.email) {
          this.username = '';
          this.password = '';
          this.router.navigateByUrl('home');
        } else {
          console.log(`Invalid user: ${this.username}`);
        }
      });
    }
  }
}
