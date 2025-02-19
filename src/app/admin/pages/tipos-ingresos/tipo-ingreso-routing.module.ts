import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoIngresoComponent } from './tipo-ingreso.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoIngresoComponent }
	])],
	exports: [RouterModule]
})
export class TipoIngresoRoutingModule { }
