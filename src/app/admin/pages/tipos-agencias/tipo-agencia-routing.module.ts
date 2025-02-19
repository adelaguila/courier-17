import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoAgenciaComponent } from './tipo-agencia.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoAgenciaComponent }
	])],
	exports: [RouterModule]
})
export class TipoAgenciaRoutingModule { }
