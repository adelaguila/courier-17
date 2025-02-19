import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ComprobanteComponent } from './comprobante.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ComprobanteComponent }
	])],
	exports: [RouterModule]
})
export class ComprobanteRoutingModule { }
