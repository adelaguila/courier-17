import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbonadoComponent } from './abonado.component';
import { PorActivarComponent } from './por-activar/por-activar.component';
import { AbonadoRegistroComponent } from './abonado-registro/abonado-registro.component';
import { MorososComponent } from './morosos/morosos.component';
import { ImprimirAvisoCobranzaComponent } from './imprimir-avisos-cobranza/imprimir-aviso-cobranza.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'lista', component: AbonadoComponent },
		{ path: 'por-activar', component: PorActivarComponent },
		{ path: 'en-mora', component: MorososComponent },
		{ path: 'detalles', component: AbonadoRegistroComponent },
		{ path: 'detalles/:id', component: AbonadoRegistroComponent },
		{ path: 'imprimir-avisos-cobranzas', component: ImprimirAvisoCobranzaComponent },
	])],
	exports: [RouterModule]
})
export class AbonadoRoutingModule { }
