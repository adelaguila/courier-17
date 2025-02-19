import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoCargoComponent } from './tipo-cargo.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoCargoComponent }
	])],
	exports: [RouterModule]
})
export class TipoCargoRoutingModule { }
