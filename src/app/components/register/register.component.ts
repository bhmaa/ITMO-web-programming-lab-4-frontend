import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService,
              private router: Router) {
  }

  register(event: Event) {
    event.preventDefault();
    this.authService.register(this.username, this.password).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/results']);
      },
      error => {
        console.error('Registration error:', error);
        this.errorMessage = error && error.error && error.error.message ? error.error.message : 'Username is already in use!';
      }
    );
  }


  login(event: Event) {
    event.preventDefault();
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        console.log('Login response:', response);
        localStorage.setItem('token', response.token);
        if (response && response.token) {
          this.router.navigate(['/results']);
        } else {
          console.error('JWT not present in response', response);
        }
      },
      error => {
        console.error('Login error:', error);
        this.errorMessage = error && error.error && error.error.message ? error.error.message : 'Wrong username or password!';
      }
    );
  }
}
