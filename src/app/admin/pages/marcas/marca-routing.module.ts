import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarcaComponent } from './marca.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MarcaComponent }
	])],
	exports: [RouterModule]
})
export class MarcaRoutingModule { }
