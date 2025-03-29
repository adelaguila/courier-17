import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TarifarioComponent } from './tarifario.component';
import { TarifarioRoutingModule } from './tarifario-routing.module';

@NgModule({
	imports: [
    CommonModule,
    TarifarioRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TarifarioComponent]
})
export class TarifarioModule { }
