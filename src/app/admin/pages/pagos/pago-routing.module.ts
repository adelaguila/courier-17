import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PagoComponent } from './pago.component';
import { PagoFechaComponent } from './pagos-fecha/pago-fecha.component';
import { PagoFechaCobradorComponent } from './pagos-fecha-cobrador/pago-fecha-cobrador.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'lista', component: PagoComponent },
		{ path: 'por-fecha', component: PagoFechaComponent },
		{ path: 'por-fecha-cobrador', component: PagoFechaCobradorComponent }
	])],
	exports: [RouterModule]
})
export class PagoRoutingModule { }
