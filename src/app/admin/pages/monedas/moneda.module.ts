import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { MonedaComponent } from './moneda.component';
import { MonedaRoutingModule } from './moneda-routing.module';

@NgModule({
	imports: [
    CommonModule,
    MonedaRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [MonedaComponent]
})
export class MonedaModule { }
