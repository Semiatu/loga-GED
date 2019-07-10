import { Validators } from '@angular/forms';

export class CustomValidators {

  public static requiredStrValidations(minLength?, maxLength?) {
    return [Validators.required, ...this.strValidations(minLength, maxLength)];
  }

  public static requiredMaxStrValidations(maxLength?) {
    return [Validators.required, Validators.maxLength(maxLength ? maxLength : 255)];
  }

  public static requiredMinStrValidations(minLength?) {
    return [Validators.required, Validators.minLength(minLength ? minLength : 1)];
  }

  public static strValidations(minLength, maxLength) {
    return [this.requiredMinStrValidations(minLength), this.requiredMaxStrValidations(maxLength)];
  }

}
