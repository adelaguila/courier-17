import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { ViaComponent } from './via.component';
import { ViaRoutingModule } from './via-routing.module';


@NgModule({
	imports: [
    CommonModule,
    ViaRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [ViaComponent]
})
export class ViaModule { }
