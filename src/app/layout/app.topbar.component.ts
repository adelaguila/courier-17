import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppConfig, LayoutService } from './service/app.layout.service';
import { LoginService } from '../admin/services/login.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent implements OnInit {
    @ViewChild('menuButton') menuButton!: ElementRef;

    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;

    config!: AppConfig;

    subscription: any;

    username: string;

    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        private loginService: LoginService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
    }
    ngOnInit(): void {
        // const helper = new JwtHelperService
        // const decodeToken = helper.decodeToken(localStorage.getItem(environment.TOKEN_NAME));

        // this.username = decodeToken.sub;
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    logout(){
        this.loginService.logout();
    }
}
