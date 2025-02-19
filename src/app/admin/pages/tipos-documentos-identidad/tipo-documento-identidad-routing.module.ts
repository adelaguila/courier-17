import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoDocumentoIdentidadComponent } from './tipo-documento-identidad.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoDocumentoIdentidadComponent }
	])],
	exports: [RouterModule]
})
export class TipoDocumentoIdentidadRoutingModule { }
