import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CajaIngresoComponent } from './caja-ingreso.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CajaIngresoComponent }
	])],
	exports: [RouterModule]
})
export class CajaIngresoRoutingModule { }
