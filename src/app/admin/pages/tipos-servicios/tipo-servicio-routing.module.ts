import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoServicioComponent } from './tipo-servicio.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoServicioComponent }
	])],
	exports: [RouterModule]
})
export class TipoServicioRoutingModule { }
