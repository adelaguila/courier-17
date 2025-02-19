import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClienteProveedorComponent } from './cliente-proveedor.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ClienteProveedorComponent }
	])],
	exports: [RouterModule]
})
export class ClienteProveedorRoutingModule { }
