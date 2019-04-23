import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
  <p class="text-danger">
    {{errorMessage}}
  </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if (this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    } else {
      return null;
    }
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if (this.formControl.errors.required) {
      return 'dado obrigatório';

    } else if (this.formControl.errors.minlength) {
      const requiredLenght = this.formControl.errors.minlength.requiredLength;
      return `deve ter no mínimo ${requiredLenght} caratceres`;

    } else if (this.formControl.errors.maxlength) {
      const requiredLenght = this.formControl.errors.maxlength.requiredLength;
      return `deve ter no máximo ${requiredLenght} caratceres`;

    } else if (this.formControl.errors.email) {
      return 'formato de email inválido';
    }

    return null;
  }
}
