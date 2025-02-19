import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SectorComponent } from './sector.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SectorComponent }
	])],
	exports: [RouterModule]
})
export class SectorRoutingModule { }
