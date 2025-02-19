import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Menu } from '../models/menu';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { MenuResponseDTO } from '../models/menu-response-dto';
import { SubMenuResponseDTO } from '../models/submenu-response-dto';

@Injectable({
    providedIn: 'root',
})
export class MenuService extends GenericService<Menu> {
    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/menus`);
    }

    getMenusByUser(username: string) {
        return this.http.post<MenuResponseDTO[]>(`${this.url}/user`, username);
    }
}
