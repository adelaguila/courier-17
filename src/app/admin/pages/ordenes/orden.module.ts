import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { OrdenComponent } from './orden.component';
import { OrdenRoutingModule } from './orden-routing.module';


@NgModule({
	imports: [
    CommonModule,
    OrdenRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [OrdenComponent]
})
export class OrdenModule { }
