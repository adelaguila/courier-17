import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AppConfig, LayoutService } from './layout/service/app.layout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService) { }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        const config: AppConfig = {
            ripple: true,                       // toggles ripple on and off
            inputStyle: 'outlined',             // default style for input elements
            menuMode: 'horizontal',                 // layout mode of the menu, valid values are "static", "overlay", "slim", "horizontal", "drawer" and "reveal"
            colorScheme: 'light',               // color scheme of the template, valid values are "light" and "dark"
            componentTheme: 'denim',            // default component theme for PrimeNG
            scale: 12,                           // size of the body font size to scale the whole application
            menuTheme: 'dim',                   // theme of the menu
            topbarTheme: 'light',               // theme of the topbar
        };
        this.layoutService.config.set(config);
    }

}
