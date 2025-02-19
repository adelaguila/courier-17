import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PrimengModule } from 'src/app/primeng/primeng.module';



@NgModule({
	imports: [
		CommonModule,
        DashboardRoutingModule,
        PrimengModule,
		FormsModule,
	],
	declarations: [DashboardComponent]
})
export class DashboardModule { }
