import { Component } from '@angular/core';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [PrimengModule, AppConfigModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    username: string;
    password: string;
    message: string;
    error: string;

    constructor(private loginService: LoginService, private router: Router) {}

    login() {
        this.loginService
            .login(this.username, this.password)
            .subscribe((data) => {
                console.log(data);
                localStorage.setItem(environment.TOKEN_NAME, data.jwtToken);
                this.router.navigate(['/pages']);
            });
    }
}
