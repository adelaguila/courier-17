import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CajaNapComponent } from './caja-nap.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CajaNapComponent }
	])],
	exports: [RouterModule]
})
export class CajaNapRoutingModule { }
