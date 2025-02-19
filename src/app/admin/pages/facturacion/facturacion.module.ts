import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { FacturacionComponent } from './facturacion.component';
import { FacturacionRoutingModule } from './facturacion-routing.module';


@NgModule({
	imports: [
    CommonModule,
    FacturacionRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [FacturacionComponent]
})
export class FacturacionModule { }
