import { Component, OnInit } from '@angular/core';

import { TodoUser } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private auth: AuthService) { }
  email: string = '';
  password: string = '';

  ngOnInit(): void {
  }

  register() {
    if(this.email == '') {
      alert('Please enter email !');
      return;
    } 
    if(this.password == '') {
      alert('Please enter password !');
      return;
    }

    
    
    this.auth.register(this.email, this.password);
    this.email = '';
    this.password = '';
  }
}
