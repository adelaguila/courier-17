import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { AbonadoComponent } from './abonado.component';
import { AbonadoRoutingModule } from './abonado-routing.module';


@NgModule({
	imports: [
    CommonModule,
    AbonadoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [AbonadoComponent]
})
export class AbonadoModule { }
