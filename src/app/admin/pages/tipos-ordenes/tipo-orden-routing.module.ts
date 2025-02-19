import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoOrdenComponent } from './tipo-orden.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoOrdenComponent }
	])],
	exports: [RouterModule]
})
export class TipoOrdenRoutingModule { }
