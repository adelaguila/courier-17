import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrdenServicioComponent } from './orden-servicio.component';
import { OrdenServicioFechaRegistroComponent } from './por-fecha/orden-servicio-fecha-registro.component';
import { OrdenServicioRegistroComponent } from './orden-servicio-registro/orden-servicio-registro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OrdenServicioComponent },
		{ path: 'por-fecha-registro', component: OrdenServicioFechaRegistroComponent },
		{ path: 'registro', component: OrdenServicioRegistroComponent },
		{ path: 'editar/:id', component: OrdenServicioRegistroComponent }
	])],
	exports: [RouterModule]
})
export class OrdenServicioRoutingModule { }
