import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { TableComponent } from "../../../shared/table/table.component";
import { OntComponent } from './ont.component';
import { OntRoutingModule } from './ont-routing.module';


@NgModule({
	imports: [
    CommonModule,
    OntRoutingModule,
    PrimengModule,
    FormsModule,
    TableComponent
],
	declarations: [OntComponent]
})
export class OntModule { }
