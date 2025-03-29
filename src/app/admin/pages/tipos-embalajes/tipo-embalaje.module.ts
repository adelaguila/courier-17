import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { TipoEmbalajeComponent } from './tipo-embalaje.component';
import { TipoEmbalajeRoutingModule } from './tipo-embalaje-routing.module';



@NgModule({
	imports: [
    CommonModule,
    TipoEmbalajeRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [TipoEmbalajeComponent]
})
export class TipoEmbalajeModule { }
