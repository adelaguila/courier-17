import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { ServicioComponent } from './servicio.component';
import { ServicioRoutingModule } from './servicio-routing.module';


@NgModule({
	imports: [
    CommonModule,
    ServicioRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [ServicioComponent]
})
export class ServicioModule { }
