import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoOrdenServicioComponent } from './tipo-orden-servicio.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoOrdenServicioComponent }
	])],
	exports: [RouterModule]
})
export class TipoOrdenServicioRoutingModule { }
