import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UbigeoComponent } from './ubigeo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UbigeoComponent }
	])],
	exports: [RouterModule]
})
export class UbigeoRoutingModule { }
