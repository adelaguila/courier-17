import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoClienteProveedorComponent } from './tipo-cliente-proveedor.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoClienteProveedorComponent }
	])],
	exports: [RouterModule]
})
export class TipoClienteProveedorRoutingModule { }
