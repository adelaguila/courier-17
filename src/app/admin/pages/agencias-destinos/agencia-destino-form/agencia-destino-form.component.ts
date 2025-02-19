import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Agencia } from 'src/app/admin/models/agencia';
import { AgenciaDestino } from 'src/app/admin/models/agencia-destino';
import { AgenciaDestinoService } from 'src/app/admin/services/agencia-destino.service';
import { AgenciaService } from 'src/app/admin/services/agencia.service';

import { UbigeoService } from 'src/app/admin/services/ubigeo.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

interface Estado {
    name: string;
    code: string;
}

@Component({
    selector: 'app-agenciaDestino-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './agencia-destino-form.component.html',
    styleUrl: './agencia-destino-form.component.scss',
})
export class AgenciaDestinoFormComponent implements OnInit {
    agenciaDestino: AgenciaDestino;
    form: FormGroup;
    title: string = '';
    submitted = false;
    ubigeosFiltrados = [];
    estados: Estado[] | undefined;
    agencias: Agencia[] | undefined;
    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private agenciaDestinoService: AgenciaDestinoService,
        private ubigeoService: UbigeoService,
        private agenciaService: AgenciaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR DESTINO';
            this.agenciaDestino = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;
            console.log(this.agenciaDestino);
            this.agenciaDestino.ubigeo.nombreUbigeo = this.agenciaDestino.ubigeo.departamento + ' - ' + this.agenciaDestino.ubigeo.provincia + ' - ' + this.agenciaDestino.ubigeo.distrito;
        } else {
            this.title = 'NUEVO DESTINO';
            this.agenciaDestino = new AgenciaDestino();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.agenciaService.findAll().subscribe((data) => (this.agencias = data));

        this.form = new FormGroup({
            idAgenciaDestino: new FormControl(this.agenciaDestino.idAgenciaDestino),
            agencia: new FormControl(this.agenciaDestino.agencia, [ Validators.required]),
            ubigeo: new FormControl(this.agenciaDestino.ubigeo),
            destino: new FormControl(this.agenciaDestino.destino, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            adicionalEntrega: new FormControl(this.agenciaDestino.adicionalEntrega, [
                Validators.required
            ]),
            adicionalRecojo: new FormControl(this.agenciaDestino.adicionalRecojo, [
                Validators.required,
            ]),
            aceptaCollec: new FormControl(this.agenciaDestino.aceptaCollec)
        });
    }
    get f() {
        return this.form.controls;
    }

    filtrarUbigeos(event: any) {
        this.ubigeoService.autocomplete(event.query).subscribe((result) => {
            this.ubigeosFiltrados = result;
        });
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
        const recordId = values.idAgenciaDestino;

        if (this.isEdit) {
            this.agenciaDestinoService.update(recordId, values).subscribe((data) => {
                this.agenciaDestinoService.setAgenciaDestinoChange(data);
                this.agenciaDestinoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.agenciaDestinoService.save(values).subscribe((data) => {
                this.agenciaDestinoService.setAgenciaDestinoChange(data);
                this.agenciaDestinoService.setMessageChange({
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
