import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-rightmenu',
    templateUrl: './app.rightmenu.component.html',
})
export class AppRightMenuComponent {
    checked1 = true;

    checked2 = true;

    checked3 = false;

    checked4 = false;

    checked5 = false;

    checked6 = false;

    checked7 = false;

    checked8 = false;
    
    constructor(public layoutService: LayoutService) {}

    get rightMenuActive(): boolean {
        return this.layoutService.state.rightMenuActive;
    }

    set rightMenuActive(_val: boolean) {
        this.layoutService.state.rightMenuActive = _val;
    }
}
