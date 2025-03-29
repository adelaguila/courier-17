import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoPagoComponent } from './tipo-pago.component';
import { TipoPagoRoutingModule } from './tipo-pago-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoPagoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoPagoComponent]
})
export class TipoPagoModule { }
