/* import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidatorDirective), multi: true }
    ]
})
export class EqualValidatorDirective implements Validator {
    constructor(@Attribute('validateEqual') public validateEqual: string,
        @Attribute('reverse') public reverse: string) {
    }

    private get isReverse() {
        if (!this.reverse) { return false; }
        return this.reverse === 'true' ? true : false;
    }

    validate(c: AbstractControl): { [key: string]: any } | null {
        // Get value of the control being validated
        const v = c.value;

        // Get control to compare with
        const e = c.root.get(this.validateEqual);

        // If comparison control doesn't exist, return null
        if (!e) {
            return null;
        }

        // If not in reverse mode and values don't match, return error
        if (v !== e.value && !this.isReverse) {
            return {
                validateEqual: false
            };
        }

        // If in reverse mode
        if (this.isReverse) {
            // If values match, clear errors on the comparison control
            if (v === e.value) {
                if (e.errors) {
                    delete e.errors['validateEqual'];
                    if (!Object.keys(e.errors).length) {
                        e.setErrors(null);
                    }
                }
            } else {
                // If values don't match, set error on comparison control
                e.setErrors({ validateEqual: false });
            }
        }

        return null;
    }
} */

import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidatorDirective), multi: true }
    ],
    standalone: false
})
export class EqualValidatorDirective implements Validator {
    constructor(@Attribute('validateEqual') public validateEqual: string,
        @Attribute('reverse') public reverse: string) {
    }

    private get isReverse() {
        if (!this.reverse) { return false; }
        return this.reverse === 'true' ? true : false;
    }

    validate(c: AbstractControl): { [key: string]: any } {
        const v = c.value;

        const e = c.root.get(this.validateEqual);

        if (e && v !== e.value && !this.isReverse) {
            return {
                validateEqual: false
            };
        }

        if (e && v === e.value && this.isReverse) {
            delete e.errors!['validateEqual'];
            if (!Object.keys(e.errors!).length) {
                e.setErrors(null);
            }
        }

        if (e && v !== e.value && this.isReverse) {
            e.setErrors({ validateEqual: false });
        }

        return null!;
    }
}

