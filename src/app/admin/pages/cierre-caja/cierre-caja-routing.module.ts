import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CierreCajaComponent } from './cierre-caja.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CierreCajaComponent },
		{ path: 'cierres-cajas', component: CierreCajaComponent }
	])],
	exports: [RouterModule]
})
export class CierreCajaRoutingModule { }
