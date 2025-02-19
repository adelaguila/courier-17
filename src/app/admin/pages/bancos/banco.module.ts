import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { BancoComponent } from './banco.component';
import { BancoRoutingModule } from './banco-routing.module';


@NgModule({
	imports: [
    CommonModule,
    BancoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [BancoComponent]
})
export class BancoModule { }
