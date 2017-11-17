import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormGroupState } from 'ngrx-forms';
import RegisterService from '../containers/Register';
import { RegisterFormData, RegisterFormState } from '../reducers/index';
import { FormInput, InputType } from './UserEditView';

@Component({
  selector: 'register-view',
  template: `
    <div id="content" class="container">
      <h1>Register page!</h1>

      <div *ngIf="errors">
        <div *ngFor="let error of errors" class="alert alert-danger" role="alert" [id]="error.field">
          {{error.message}}
        </div>
      </div>

      <register-form [onSubmit]="onSubmit" [formState]="formState" [form]="form"></register-form>
    </div>
  `
})
export default class RegisterView {
  public errors: any[];
  public formState: FormGroupState<RegisterFormData>;
  public form: FormInput[];

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private store: Store<RegisterFormState>
  ) {
    this.form = this.createForm();
    store.select(s => s.registerForm).subscribe((res: any) => {
      this.formState = res;
    });
  }

  public onSubmit = (regInputs: any) => {
    const { username, email, password } = regInputs;
    this.registerService.register(username, email, password, ({ data: { register } }: any) => {
      if (register.errors) {
        this.errors = register.errors;
        return;
      }

      this.router.navigateByUrl('login');
    });
  };

  private createForm = (): FormInput[] => {
    return [
      {
        id: 'username-input',
        name: 'username',
        value: 'Username',
        type: 'text',
        placeholder: 'Username',
        inputType: InputType.INPUT,
        minLength: 3
      },
      {
        id: 'email-input',
        name: 'email',
        value: 'Email',
        type: 'email',
        placeholder: 'Email',
        inputType: InputType.INPUT,
        minLength: 1
      },
      {
        id: 'password-input',
        name: 'password',
        value: 'Password',
        type: 'password',
        placeholder: 'Password',
        inputType: InputType.INPUT,
        minLength: 5
      },
      {
        id: 'passwordConfirmation-input',
        name: 'passwordConfirmation',
        value: 'Password Confirmation',
        type: 'password',
        placeholder: 'Password Confirmation',
        inputType: InputType.INPUT,
        minLength: 5
      }
    ];
  };
}