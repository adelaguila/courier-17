import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoDocumentoIdentidadComponent } from './tipo-documento-identidad.component';
import { TipoDocumentoIdentidadRoutingModule } from './tipo-documento-identidad-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoDocumentoIdentidadRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoDocumentoIdentidadComponent]
})
export class TipoDocumentoIdentidadModule { }
