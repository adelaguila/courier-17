import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { AgenciaComponent } from './agencia.component';
import { AgenciaRoutingModule } from './agencia-routing.module';

@NgModule({
	imports: [
    CommonModule,
    AgenciaRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [AgenciaComponent]
})
export class AgenciaModule { }
