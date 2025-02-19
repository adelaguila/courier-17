import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoViaComponent } from './tipo-via.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoViaComponent }
	])],
	exports: [RouterModule]
})
export class TipoViaRoutingModule { }
