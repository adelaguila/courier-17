import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoCargoComponent } from './tipo-cargo.component';
import { TipoCargoRoutingModule } from './tipo-cargo-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoCargoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoCargoComponent]
})
export class TipoCargoModule { }
