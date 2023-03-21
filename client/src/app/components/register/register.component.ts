import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() email?: string;
  @Input() password?: string;
  @Input() passwordConfirm?: string;
  @Input() firstName?: string;
  @Input() lastName?: string;
  errorOccured: boolean = false;
  errorMsg: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.email = '';
    this.password = '';
    this.passwordConfirm = '';
    this.firstName = '';
    this.lastName = '';
  }

  register() {
    this.errorOccured = false;

    if (
      this.email &&
      this.password &&
      this.passwordConfirm &&
      this.firstName &&
      this.lastName
    ) {
      var validEmailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (this.password != this.passwordConfirm) {
        this.errorOccured = true;
        this.errorMsg = 'Passwords do not match.';
        return;
      }
      if (!this.email.match(validEmailRegex)) {
        this.errorOccured = true;
        this.errorMsg = 'Invalid email address.';
        return;
      }

      this.authService
        .register(this.email, this.password, this.firstName, this.lastName)
        .subscribe((user) => {
          if (typeof user === 'object' && 'email' in user && user.email) {
            this.email = '';
            this.password = '';
            this.passwordConfirm = '';
            this.firstName = '';
            this.lastName = '';
            this.router.navigateByUrl('login');
          } else if (typeof user === 'object' && 'msg' in user) {
            this.errorMsg = user.msg;
            this.errorOccured = true;
            this.password = '';
            this.passwordConfirm = '';
          }
        });
    }
  }

  login() {
    this.errorOccured = false;
    this.email = '';
    this.password = '';
    this.passwordConfirm = '';
    this.firstName = '';
    this.lastName = '';
    this.router.navigateByUrl('login');
  }
}
