import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { UbigeoComponent } from './ubigeo.component';
import { UbigeoRoutingModule } from './ubigeo-routing.module';

@NgModule({
	imports: [
    CommonModule,
    UbigeoRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [UbigeoComponent]
})
export class UbigeoModule { }
