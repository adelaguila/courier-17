import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoOrdenServicioComponent } from './tipo-orden-servicio.component';
import { TipoOrdenServicioRoutingModule } from './tipo-orden-servicio-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoOrdenServicioRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoOrdenServicioComponent]
})
export class TipoOrdenServicioModule { }
