import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {


  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });


  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    null;
  }

  submit() {
    throw new Error('Method not implemented.');
  }

  loginWithGoogle() {
    throw new Error('Method not implemented.');
    }
    
  // createLoginForm() {
  //   this.loginForm = this.formBuilder.group({
  //     email: new FormControl('', [Validators.required, Validators.email]),
  //     password: new FormControl('', [
  //       Validators.required,
  //       Validators.minLength(6),
  //     ]),
  //   });
  // }
}
