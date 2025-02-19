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
import { TipoAgencia } from 'src/app/admin/models/tipo-agencia';
import { AgenciaService } from 'src/app/admin/services/agencia.service';
import { TipoAgenciaService } from 'src/app/admin/services/tipo-agencia.service';
import { UbigeoService } from 'src/app/admin/services/ubigeo.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

interface Estado {
    name: string;
    code: string;
}

@Component({
    selector: 'app-agencia-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './agencia-form.component.html',
    styleUrl: './agencia-form.component.scss',
})
export class AgenciaFormComponent implements OnInit {
    agencia: Agencia;
    form: FormGroup;
    title: string = '';
    submitted = false;
    ubigeosFiltrados = [];
    estados: Estado[] | undefined;
    tiposAgencias: TipoAgencia[] | undefined;
    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private agenciaService: AgenciaService,
        private ubigeoService: UbigeoService,
        private tipoAgenciaService: TipoAgenciaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        this.estados = [
            { name: "ACTIVO", code: "A" },
            { name: "DESACTIVADO", code: "D" },
        ];

        if (this.config.data) {
            this.title = 'EDITAR AGENCIA';
            this.agencia = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;
            this.agencia.ubigeo.nombreUbigeo = this.agencia.ubigeo.departamento + ' - ' + this.agencia.ubigeo.provincia + ' - ' + this.agencia.ubigeo.distrito;
        } else {
            this.title = 'NUEVO AGENCIA';
            this.agencia = new Agencia();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.tipoAgenciaService.findAll().subscribe((data) => (this.tiposAgencias = data));

        this.form = new FormGroup({
            idAgencia: new FormControl(this.agencia.idAgencia),
            codigo: new FormControl(this.agencia.codigo, [ Validators.required,
                Validators.minLength(5),
                Validators.maxLength(5),]),
            nombreAgencia: new FormControl(this.agencia.nombreAgencia, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            nombreAgente: new FormControl(this.agencia.nombreAgente, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            dniAgente: new FormControl(this.agencia.dniAgente, [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(8),
            ]),
            direccion: new FormControl(this.agencia.direccion, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            telefono: new FormControl(this.agencia.telefono, [
                Validators.required,
                Validators.minLength(9),
                Validators.maxLength(9),
            ]),
            correo: new FormControl(this.agencia.correo, [
                Validators.required,
                Validators.email,
            ]),
            latitud: new FormControl(this.agencia.latitud),
            longitud: new FormControl(this.agencia.longitud),
            mapa: new FormControl(this.agencia.mapa),
            ubigeo: new FormControl(this.agencia.ubigeo),
            tipoAgencia: new FormControl(this.agencia.tipoAgencia),
            activo: new FormControl(this.agencia.activo)
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
        const recordId = values.idAgencia;

        if (this.isEdit) {
            this.agenciaService.update(recordId, values).subscribe((data) => {
                this.agenciaService.setAgenciaChange(data);
                this.agenciaService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.agenciaService.save(values).subscribe((data) => {
                this.agenciaService.setAgenciaChange(data);
                this.agenciaService.setMessageChange({
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
