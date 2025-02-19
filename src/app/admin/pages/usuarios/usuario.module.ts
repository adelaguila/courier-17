import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioComponent } from './usuario.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { TableComponent } from "../../../shared/table/table.component";

@NgModule({
	imports: [
    CommonModule,
    UsuarioRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [UsuarioComponent]
})
export class UsuarioModule { }
