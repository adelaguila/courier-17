import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LiquidacionComponent } from './liquidacion.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: LiquidacionComponent },
	])],
	exports: [RouterModule]
})
export class LiquidacionRoutingModule { }
