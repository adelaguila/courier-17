import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoEgresoComponent } from './tipo-egreso.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoEgresoComponent }
	])],
	exports: [RouterModule]
})
export class TipoEgresoRoutingModule { }
