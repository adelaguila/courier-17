import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrdenComponent } from './orden.component';
import { OrdenPorAsignarComponent } from './por-asignar/orden-por-asignar.component';
import { OrdenPorAtenderComponent } from './por-atender/orden-por-atender.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'lista', component: OrdenComponent },
		{ path: 'por-asignar', component: OrdenPorAsignarComponent },
		{ path: 'por-atender', component: OrdenPorAtenderComponent },
	])],
	exports: [RouterModule]
})
export class OrdenRoutingModule { }
