import { Component, OnInit } from '@angular/core';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PrimengModule } from 'src/app/primeng/primeng.module';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { Message } from 'primeng/api';
import { LoginService } from 'src/app/admin/services/login.service';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [PrimengModule, AppConfigModule, ReactiveFormsModule],
    templateUrl: './random.component.html',
    styleUrl: './random.component.scss',
})
export class RandomComponent implements OnInit {
    form: FormGroup;
    token: string;
    message: string;
    error: string;
    rpta: number;
    validRandom: boolean;

    messages: Message[] | undefined;
    messages1: Message[] | undefined;
    messages2: Message[] | undefined;

    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private loginService: LoginService
    ) {}
    ngOnInit(): void {

        this.messages = [
            { severity: 'info', summary: 'Info', detail: 'Password not match' },
        ];
        this.messages1 = [
            { severity: 'success', summary: 'Success', detail: 'Password has been change' },
        ];
        this.messages2 = [
            { severity: 'error', summary: 'Error', detail: 'Algo salió mal' },
        ];

        this.form = this._formBuilder.group(
            {
                password: [
                    '',
                    {
                        validators: [
                            Validators.required,
                            Validators.minLength(3),
                        ],
                    },
                ],
                confirmPassword: [
                    '',
                    {
                        validators: [
                            Validators.required,
                            Validators.minLength(3),
                        ],
                    },
                ],
            },
            { validators: this.matchingPasswords() }
        );

        this.route.params.subscribe((params: Params) => {
            this.token = params['random'];
            this.loginService.checkTokenReset(this.token).subscribe((data) => {
                if (data === 1) {
                    this.validRandom = true;
                } else {
                    this.validRandom = false;
                    setTimeout(() => {
                        this.router.navigate(['login']);
                    }, 2000);
                }
            });
        });
    }

    get f() {
        return this.form.controls;
    }

    matchingPasswords() {
        return (controls: AbstractControl) => {
            if (controls) {
                const password = controls.get('password')!.value;
                const confirmPassword = controls.get('confirmPassword')!.value;
                if (password !== confirmPassword) {
                    controls
                        .get('confirmPassword')
                        ?.setErrors({ not_the_same: true });
                    return { mismatchedPassword: true };
                }
            }
            return null;
        };
    }

    onSubmit() {
        let clave: string = this.form.value.confirmPassword;
        this.loginService.reset(this.token, clave).subscribe((data) => {
            this.message = 'Password has been change';

            setTimeout(() => {
                this.router.navigate(['login']);
            }, 2000);
        });
    }
}
