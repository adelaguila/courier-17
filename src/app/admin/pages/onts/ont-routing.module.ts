import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OntComponent } from './ont.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OntComponent }
	])],
	exports: [RouterModule]
})
export class OntRoutingModule { }
