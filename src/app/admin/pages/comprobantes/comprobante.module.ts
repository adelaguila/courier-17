import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { ComprobanteComponent } from './comprobante.component';
import { ComprobanteRoutingModule } from './comprobante-routing.module';

@NgModule({
	imports: [
    CommonModule,
    ComprobanteRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [ComprobanteComponent]
})
export class ComprobanteModule { }
