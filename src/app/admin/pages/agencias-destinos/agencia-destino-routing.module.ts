import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgenciaDestinoComponent } from './agencia-destino.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AgenciaDestinoComponent }
	])],
	exports: [RouterModule]
})
export class AgenciaDestinoRoutingModule { }
