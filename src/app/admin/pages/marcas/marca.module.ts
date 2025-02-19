import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { MarcaComponent } from './marca.component';
import { MarcaRoutingModule } from './marca-routing.module';


@NgModule({
	imports: [
    CommonModule,
    MarcaRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [MarcaComponent]
})
export class MarcaModule { }
