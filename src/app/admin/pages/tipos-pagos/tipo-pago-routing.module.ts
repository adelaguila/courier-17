import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoPagoComponent } from './tipo-pago.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoPagoComponent }
	])],
	exports: [RouterModule]
})
export class TipoPagoRoutingModule { }
