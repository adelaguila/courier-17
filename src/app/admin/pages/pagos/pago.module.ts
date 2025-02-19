import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { PagoComponent } from './pago.component';
import { PagoRoutingModule } from './pago-routing.module';


@NgModule({
	imports: [
    CommonModule,
    PagoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [PagoComponent]
})
export class PagoModule { }
