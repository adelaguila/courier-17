import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { ClienteProveedorComponent } from './cliente-proveedor.component';
import { ClienteProveedorRoutingModule } from './cliente-proveedor-routing.module';

@NgModule({
	imports: [
    CommonModule,
    ClienteProveedorRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [ClienteProveedorComponent]
})
export class ClienteProveedorModule { }
