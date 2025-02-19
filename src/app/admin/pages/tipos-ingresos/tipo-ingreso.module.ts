import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoIngresoComponent } from './tipo-ingreso.component';
import { TipoIngresoRoutingModule } from './tipo-ingreso-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoIngresoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoIngresoComponent]
})
export class TipoIngresoModule { }
