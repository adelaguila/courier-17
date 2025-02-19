import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CierreCajaComponent } from './cierre-caja.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { CierreCajaRoutingModule } from './cierre-caja-routing.module';
import { TableComponent } from "../../../shared/table/table.component";

@NgModule({
	imports: [
    CommonModule,
    CierreCajaRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [CierreCajaComponent]
})
export class CierreCajaModule { }
