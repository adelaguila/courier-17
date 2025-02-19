import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanComponent } from './plan.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { PlanRoutingModule } from './plan-routing.module';
import { TableComponent } from "../../../shared/table/table.component";

@NgModule({
	imports: [
    CommonModule,
    PlanRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [PlanComponent]
})
export class PlanModule { }
