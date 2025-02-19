import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoViaComponent } from './tipo-via.component';
import { TipoViaRoutingModule } from './tipo-via-routing.module';


@NgModule({
	imports: [
    CommonModule,
    TipoViaRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoViaComponent]
})
export class TipoViaModule { }
