import { Component, OnInit } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AppComponent } from "src/app/app.component";
import { AppMainComponent } from "src/app/app.main.component";
import { LoginService } from "src/app/service/login.service";
import { UserService } from "src/app/service/user.service";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-topbar",
    templateUrl: "./topbar.component.html",
    styleUrls: ["./topbar.component.scss"],
})
export class AppTopbarComponent implements OnInit {
    username: string;
    name: string;

    constructor(
        public appMain: AppMainComponent,
        public app: AppComponent,
        private loginService: LoginService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        const helper = new JwtHelperService
        const decodeToken = helper.decodeToken(localStorage.getItem(environment.TOKEN_NAME));
        this.username = decodeToken.sub;
        this.userService.findOneByUsername(this.username).subscribe((user) =>{
            this.name = user.name;
        })

    }

    logout(){
        this.loginService.logout();
    }
}
