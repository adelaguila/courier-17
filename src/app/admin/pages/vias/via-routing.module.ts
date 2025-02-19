import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViaComponent } from './via.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ViaComponent }
	])],
	exports: [RouterModule]
})
export class ViaRoutingModule { }
