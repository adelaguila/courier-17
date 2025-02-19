import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CajaMovimientoFechaComponent } from './caja-movimiento-fecha.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CajaMovimientoFechaComponent }
	])],
	exports: [RouterModule]
})
export class CajaMovimientoFechaRoutingModule { }
