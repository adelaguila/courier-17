import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlmacenComponent } from './almacen.component';
import { AlmacenIngresoComponent } from './almacen-ingreso/almacen-ingreso.component';
import { AlmacenSalidaComponent } from './almacen-salida/almacen-salida.component';
import { EmpleadoInventarioComponent } from './empleado/empleado-inventario/empleado-inventario.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'lista', component: AlmacenComponent },
		{ path: 'ingreso', component: AlmacenIngresoComponent },
		{ path: 'ingreso/:id', component: AlmacenIngresoComponent },
		{ path: 'salida', component: AlmacenSalidaComponent },
		{ path: 'salida/:id', component: AlmacenSalidaComponent },
		{ path: 'inventario-empleado', component: EmpleadoInventarioComponent },
	])],
	exports: [RouterModule]
})
export class AlmacenRoutingModule { }
