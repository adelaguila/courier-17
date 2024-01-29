import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './checkoutform.component.html',
})
export class CheckoutFormComponent {

    quantities: number[] = [1, 1, 1];

    value: string = '';

    checked: boolean = true;

    checked2: boolean = true;

    cities = [
        { name: 'USA / New York', code: 'NY' },
        { name: 'Italy / Rome', code: 'RM' },
        { name: 'United Kingdom / London', code: 'LDN' },
        { name: 'Turkey / Istanbul', code: 'IST' },
        { name: 'France / Paris', code: 'PRS' }
    ];

    selectedCity: string = '';

    constructor(public layoutService: LayoutService) {}

    get rtl() {
        return this.layoutService.config().rtl;
    }
}
