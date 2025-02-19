import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServicioComponent } from './servicio.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ServicioComponent }
	])],
	exports: [RouterModule]
})
export class ServicioRoutingModule { }
