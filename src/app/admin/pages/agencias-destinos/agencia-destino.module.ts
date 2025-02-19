import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { AgenciaDestinoComponent } from './agencia-destino.component';
import { AgenciaDestinoRoutingModule } from './agencia-destino-routing.module';

@NgModule({
	imports: [
    CommonModule,
    AgenciaDestinoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [AgenciaDestinoComponent]
})
export class AgenciaDestinoModule { }
