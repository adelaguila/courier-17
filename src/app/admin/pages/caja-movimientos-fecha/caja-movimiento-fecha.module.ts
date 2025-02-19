import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { CajaMovimientoFechaRoutingModule } from './caja-movimiento-fecha-routing.module';
import { CajaMovimientoFechaComponent } from './caja-movimiento-fecha.component';



@NgModule({
	imports: [
    CommonModule,
    CajaMovimientoFechaRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    TableComponent
],
	declarations: [CajaMovimientoFechaComponent]
})
export class CajaMovimientoFechaModule { }

