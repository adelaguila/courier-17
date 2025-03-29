import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoEnvioComponent } from './tipo-envio.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoEnvioComponent }
	])],
	exports: [RouterModule]
})
export class TipoEnvioRoutingModule { }
