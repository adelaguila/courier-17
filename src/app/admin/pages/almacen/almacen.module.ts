import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { AlmacenComponent } from './almacen.component';
import { AlmacenRoutingModule  } from './almacen-routing.module';


@NgModule({
	imports: [
    CommonModule,
    AlmacenRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [AlmacenComponent]
})
export class AlmacenModule { }
