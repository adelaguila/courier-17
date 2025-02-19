import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { LiquidacionComponent } from './liquidacion.component';
import { LiquidacionRoutingModule } from './liquidacion-routing.module';


@NgModule({
	imports: [
    CommonModule,
    LiquidacionRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [LiquidacionComponent]
})
export class LiquidacionModule { }
