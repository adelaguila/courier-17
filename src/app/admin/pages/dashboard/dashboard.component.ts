import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    username: string;

    constructor(
        private menuService: MenuService
    ){}


    ngOnInit(): void {
        // const helper = new JwtHelperService
        // const decodeToken = helper.decodeToken(localStorage.getItem(environment.TOKEN_NAME));

        // this.username = decodeToken.sub;

        // this.menuService.getMenusByUser(this.username).subscribe(data => {
        //     console.log('Desde el componente: ', data);
        // })


    }


}
