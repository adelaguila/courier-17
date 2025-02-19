import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoAgenciaComponent } from './tipo-agencia.component';
import { TipoAgenciaRoutingModule } from './tipo-agencia-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoAgenciaRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoAgenciaComponent]
})
export class TipoAgenciaModule { }
