import { Component } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
@Component({
    templateUrl: './invoice.component.html'
})
export class InvoiceComponent {
    constructor( public app: AppComponent) {
      
    }

    print() {
        window.print();
    }
 }
