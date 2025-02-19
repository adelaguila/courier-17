import { Component, OnInit } from '@angular/core';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PrimengModule } from 'src/app/primeng/primeng.module';

import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { Message } from 'primeng/api';
import { LoginService } from 'src/app/admin/services/login.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [PrimengModule, AppConfigModule, RouterOutlet, FormsModule, NgIf],
    templateUrl: './forgot.component.html',
    styleUrl: './forgot.component.scss',
})
export class ForgotComponent implements OnInit {
    email: string;
    message: string;
    error: string;

    messages: Message[] | undefined;
    messages1: Message[] | undefined;

    constructor(
        private loginService: LoginService,
        private router: Router,
        public route: ActivatedRoute
    ) {}
    ngOnInit(): void {
        this.messages = [
            {
                severity: 'success',
                summary: 'Success',
                detail: 'Correo enviado!!',
            },
        ];
        this.messages1 = [
            {
                severity: 'info',
                summary: 'Info',
                detail: 'El usuario no existe',
            },
        ];
    }

    sendMail() {
        this.loginService.sendMail(this.email).subscribe((data) => {
            if (data === 1) {
                this.message = 'Correo enviado!';
                this.error = null;
            } else {
                this.error = 'Usuario no existe';
            }
        });
    }
}
