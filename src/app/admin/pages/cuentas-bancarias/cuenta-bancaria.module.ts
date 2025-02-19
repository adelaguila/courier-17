import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { CuentaBancariaComponent } from './cuenta-bancaria.component';
import { CuentaBancariaRoutingModule } from './cuenta-bancaria-routing.module';


@NgModule({
	imports: [
    CommonModule,
    CuentaBancariaRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [CuentaBancariaComponent]
})
export class CuentaBancariaModule { }
