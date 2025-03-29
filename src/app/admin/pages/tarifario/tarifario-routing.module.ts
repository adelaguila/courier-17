import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TarifarioComponent } from './tarifario.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TarifarioComponent }
	])],
	exports: [RouterModule]
})
export class TarifarioRoutingModule { }
