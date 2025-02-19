import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlanComponent } from './plan.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PlanComponent }
	])],
	exports: [RouterModule]
})
export class PlanRoutingModule { }
