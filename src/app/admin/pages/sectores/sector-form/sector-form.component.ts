import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Sector } from 'src/app/admin/models/sector';
import { SectorService } from 'src/app/admin/services/sector.service';


import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-sector-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './sector-form.component.html',
    styleUrl: './sector-form.component.scss',
})
export class SectorFormComponent implements OnInit {
    sector: Sector;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private sectorService: SectorService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR SECTOR';
            this.sector = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO SECTOR';
            this.sector = new Sector();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.form = new FormGroup({
            idSector: new FormControl(this.sector?.idSector),
            nombreSector: new FormControl(this.sector?.nombreSector, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            descripcion: new FormControl(this.sector?.descripcion)
        });
    }
    get f() {
        return this.form.controls;
    }

    operate() {
        if (this.form.invalid) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'El formulario es inválido',
                life: 3000,
            });

            return;
        }

        const values = this.form.value;
        const recordId = values.idSector;

        if (this.isEdit) {
            this.sectorService.update(recordId, values).subscribe((data) => {
                this.sectorService.setSectorChange(data);
                this.sectorService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.sectorService.save(values).subscribe((data) => {
                this.sectorService.setSectorChange(data);
                this.sectorService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos creados correctamente',
                    life: 3000,
                });
            });
        }

        this.close();
    }

    close() {
        this.ref.close();
    }
}
