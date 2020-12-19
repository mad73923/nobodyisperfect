import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '@app/_services';
import { User } from '@app/_models';
@Component({
  selector: 'app-addnewuser',
  templateUrl: './addnewuser.component.html',
  styleUrls: ['./addnewuser.component.less']
})
export class AddnewuserComponent implements OnInit {

  loading = false;
  error = '';
  serverMessage = '';
  submitted = false;
  newUserForm: FormGroup;


  constructor(private userService: UserService,
    private formBuilder: FormBuilder) { }

  // convenience getter for easy access to form fields
  get f() { return this.newUserForm.controls; }

  ngOnInit(): void {
    this.newUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
  });
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.serverMessage = '';

      // stop here if form is invalid
      if (this.newUserForm.invalid) {
        return;
    }
    this.submitted = false;
    
    this.loading = true;
    let user = new User();
    user.firstName = this.f.firstname.value;
    user.lastName = this.f.lastname.value;
    user.username = this.f.username.value;
    user.password = this.f.password.value;
    this.userService.addNewUser(user)
        .pipe(first())
        .subscribe(
            data => {
                this.newUserForm.reset();
                this.serverMessage = data.message;
                this.loading = false;
            },
            error => {
                this.error = error;
                this.loading = false;
                this.loading = false;
            });
  }
}
