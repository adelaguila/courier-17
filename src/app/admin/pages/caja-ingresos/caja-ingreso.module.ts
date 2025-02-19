import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { CajaIngresoComponent } from './caja-ingreso.component';
import { CajaIngresoRoutingModule } from './caja-ingreso-routing.module';



@NgModule({
	imports: [
    CommonModule,
    CajaIngresoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [CajaIngresoComponent]
})
export class CajaIngresoModule { }
