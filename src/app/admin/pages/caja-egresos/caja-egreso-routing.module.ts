import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CajaEgresoComponent } from './caja-egreso.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CajaEgresoComponent }
	])],
	exports: [RouterModule]
})
export class CajaEgresoRoutingModule { }
