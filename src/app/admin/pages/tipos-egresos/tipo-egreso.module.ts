import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoEgresoComponent } from './tipo-egreso.component';
import { TipoEgresoRoutingModule } from './tipo-egreso-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoEgresoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoEgresoComponent]
})
export class TipoEgresoModule { }
