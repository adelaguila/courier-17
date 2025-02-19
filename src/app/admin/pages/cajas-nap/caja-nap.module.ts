import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { CajaNapComponent } from './caja-nap.component';
import { CajaNapRoutingModule } from './caja-nap-routing.module';


@NgModule({
	imports: [
    CommonModule,
    CajaNapRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [CajaNapComponent]
})
export class CajaNapModule { }
