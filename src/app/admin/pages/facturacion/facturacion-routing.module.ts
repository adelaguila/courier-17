import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FacturacionComponent } from './facturacion.component';
import { FacturacionRegistroComponent } from './facturacion-registro/facturacion-registro.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'lista', component: FacturacionComponent },
		{ path: 'nuevo', component: FacturacionRegistroComponent },
	])],
	exports: [RouterModule]
})
export class FacturacionRoutingModule { }
