import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoEmbalajeComponent } from './tipo-embalaje.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoEmbalajeComponent }
	])],
	exports: [RouterModule]
})
export class TipoEmbalajeRoutingModule { }
