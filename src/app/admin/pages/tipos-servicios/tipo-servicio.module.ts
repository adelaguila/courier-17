import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoServicioComponent } from './tipo-servicio.component';
import { TipoServicioRoutingModule } from './tipo-servicio-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoServicioRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoServicioComponent]
})
export class TipoServicioModule { }
