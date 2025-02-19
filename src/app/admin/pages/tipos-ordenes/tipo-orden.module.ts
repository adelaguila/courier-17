import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoOrdenComponent } from './tipo-orden.component';
import { TipoOrdenRoutingModule } from './tipo-orden-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoOrdenRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoOrdenComponent]
})
export class TipoOrdenModule { }
