import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoClienteProveedorComponent } from './tipo-cliente-proveedor.component';
import { TipoClienteProveedorRoutingModule } from './tipo-cliente-proveedor-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoClienteProveedorRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoClienteProveedorComponent]
})
export class TipoClienteProveedorModule { }
