import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoEnvioComponent } from './tipo-envio.component';
import { TipoEnvioRoutingModule } from './tipo-envio-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoEnvioRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoEnvioComponent]
})
export class TipoEnvioModule { }
