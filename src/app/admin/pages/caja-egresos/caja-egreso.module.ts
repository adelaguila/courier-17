import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { CajaEgresoComponent } from './caja-egreso.component';
import { CajaEgresoRoutingModule } from './caja-egreso-routing.module';



@NgModule({
	imports: [
    CommonModule,
    CajaEgresoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [CajaEgresoComponent]
})
export class CajaEgresoModule { }
