import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { OrdenServicioComponent } from './orden-servicio.component';
import { OrdenServicioRoutingModule } from './orden-servicio-routing.module';

@NgModule({
	imports: [
    CommonModule,
    OrdenServicioRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [OrdenServicioComponent]
})
export class OrdenServicioModule { }
