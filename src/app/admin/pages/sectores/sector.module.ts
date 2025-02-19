import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { SectorComponent } from './sector.component';
import { SectorRoutingModule } from './sector-routing.module';


@NgModule({
	imports: [
    CommonModule,
    SectorRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [SectorComponent]
})
export class SectorModule { }
