import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { LoginService } from '../admin/services/login.service';
import { MenuService } from '../admin/services/menu.service';
import { MenuResponseDTO } from '../admin/models/menu-response-dto';

export const CertGuard = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router = inject(Router);
    const loginService = inject(LoginService);
    const menuService = inject(MenuService);

    // 1- verificar si el usuario esta loguado
    const rpta = loginService.isLogged();
    if (!rpta) {
        loginService.logout();
        return false;
    }

    // 2- verificar si el token no ha expirado
    const helper = new JwtHelperService();
    const token = localStorage.getItem(environment.TOKEN_NAME);

    if (!helper.isTokenExpired(token)) {
        // 3- verificar si tiene el rol necesario para acceder a este componente
        const url = state.url;
        const decodedToken = helper.decodeToken(token);
        const username = decodedToken.sub;

        // if(url == '/login'){
        //     router.navigate(['/pages']);
        //     return true;
        // }

        // console.log('Url ', url);

        return menuService.getMenusByUser(username).pipe(
            map((data: MenuResponseDTO[]) => {
                // console.log(data);
                let count = 0;
                for (let m of data) {
                    // if(url == m.url){
                    // console.log(m);
                    for (let sm of m.items) {
                        // console.log('Valor ', sm);
                        // console.log('Url ', url);
                        if (url.startsWith(sm.routerLink)) {
                            count++;
                            break;
                        }
                    }
                }

                if (count > 0) {
                    return true;
                } else {
                    router.navigate(['/access']);
                    return false;
                }
            })
        );
    } else {
        loginService.logout();
        return false;
    }

    return true;
};
