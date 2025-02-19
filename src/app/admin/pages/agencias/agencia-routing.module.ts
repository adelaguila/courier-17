import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgenciaComponent } from './agencia.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AgenciaComponent }
	])],
	exports: [RouterModule]
})
export class AgenciaRoutingModule { }
