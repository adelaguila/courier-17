import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
    templateUrl: './landing.component.html',
})
export class LandingComponent {
    sidebarVisible: boolean = false;
    constructor(public router: Router) {}
    scrollToElement($element: any): void {
        setTimeout(() => {
            $element.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            });
        }, 200);
    }
}
