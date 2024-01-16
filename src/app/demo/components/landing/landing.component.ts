import { Component } from '@angular/core';

@Component({
    templateUrl: './landing.component.html',
})
export class LandingComponent {
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
