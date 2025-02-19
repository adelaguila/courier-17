import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoComponent } from './producto.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { ProductoRoutingModule } from './producto-routing.module';
import { TableComponent } from "../../../shared/table/table.component";

@NgModule({
	imports: [
    CommonModule,
    ProductoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [ProductoComponent]
})
export class ProductoModule { }
