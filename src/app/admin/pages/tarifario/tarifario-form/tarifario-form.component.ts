import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AgenciaDestino } from 'src/app/admin/models/agencia-destino';
import { ClienteProveedor } from 'src/app/admin/models/cliente-proveedor';
import { ClienteProveedorArea } from 'src/app/admin/models/cliente-proveedor-area';
import { Tarifario } from 'src/app/admin/models/tarifario';
import { TipoEnvio } from 'src/app/admin/models/tipo-envio';
import { TipoServicio } from 'src/app/admin/models/tipo-servicio';
import { AgenciaDestinoService } from 'src/app/admin/services/agencia-destino.service';
import { ClienteProveedorService } from 'src/app/admin/services/cliente-proveedor.service';

import { TarifarioService } from 'src/app/admin/services/tarifario.service';
import { TipoEnvioService } from 'src/app/admin/services/tipo-envio.service';
import { TipoServicioService } from 'src/app/admin/services/tipo-servicio.service';

import { UbigeoService } from 'src/app/admin/services/ubigeo.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-tarifario-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './tarifario-form.component.html',
    styleUrl: './tarifario-form.component.scss',
})
export class TarifarioFormComponent implements OnInit {
    tarifario: Tarifario;
    tarifarioNew: Tarifario;
    form: FormGroup;
    title: string = '';
    submitted = false;
    origenesFiltrados = [];
    destinosFiltrados = [];
    clientesFiltrados = [];
    destinos: AgenciaDestino[] | undefined;
    tiposServicios: TipoServicio[] | undefined;
    tiposEnvios: TipoEnvio[] | undefined;
    clientesProveedoresAreas: ClienteProveedorArea[] | undefined;
    readOnlyID: boolean = false;
    isEdit: boolean = false;
    clienteSeleccionado: ClienteProveedor;

    constructor(
        private tarifarioService: TarifarioService,
        private ubigeoService: UbigeoService,
        private agenciaDestinoService: AgenciaDestinoService,
        private clienteProveedorService: ClienteProveedorService,
        private tipoServicioService: TipoServicioService,
        private tipoEnvioService: TipoEnvioService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {


        if (this.config.data) {
            this.title = 'EDITAR TARIFARIO';
            this.tarifario = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;

            this.tarifario.origen.nombreUbigeo = this.tarifario.origen.departamento + ' - ' + this.tarifario.origen.provincia + ' - ' + this.tarifario.origen.distrito;
            this.tarifario.destino.nombreAgenciaDestino = this.tarifario.destino.ubigeo.departamento + ' - ' + this.tarifario.destino.ubigeo.provincia + ' - ' + this.tarifario.destino.destino;
        } else {
            this.title = 'NUEVO TARIFARIO';
            this.tarifario = new Tarifario();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.tipoServicioService.findAll().subscribe((data) => (this.tiposServicios = data));
        this.tipoEnvioService.findAll().subscribe((data) => (this.tiposEnvios = data));

        this.form = new FormGroup({
            idTarifario: new FormControl(this.tarifario.idTarifario),
            origen: new FormControl(this.tarifario.origen, Validators.required),
            destino: new FormControl(this.tarifario.destino, Validators.required),
            clienteProveedor: new FormControl(this.tarifario.clienteProveedor),
            clienteProveedorArea: new FormControl(this.tarifario.clienteProveedorArea),
            tipoServicio: new FormControl(this.tarifario.tipoServicio, Validators.required),
            tipoEnvio: new FormControl(this.tarifario.tipoEnvio, Validators.required),
            pesoCondicional: new FormControl(this.tarifario.pesoCondicional, [
                Validators.required
            ]),
            tarifaMinima: new FormControl(this.tarifario.tarifaMinima, [
                Validators.required,
            ]),
            tarifaExeso: new FormControl(this.tarifario.tarifaExeso, [
                Validators.required,
            ]),
            pesoMinimo: new FormControl(this.tarifario.pesoMinimo, [
                Validators.required,
            ]),
            collect: new FormControl(this.tarifario.collect)
        });
    }
    get f() {
        return this.form.controls;
    }

    filtrarOrigenes(event: any) {
        this.ubigeoService.autocomplete(event.query).subscribe((result) => {
            this.origenesFiltrados = result;
        });
    }

    filtrarDestinos(event: any) {
        this.agenciaDestinoService.autocomplete(event.query).subscribe((result) => {
            this.destinosFiltrados = result;
        });
    }

    filtrarClientes(event: any) {
        this.clienteProveedorService.autocomplete(event.query).subscribe((result) => {
            this.clientesFiltrados = result;
        });
    }

    onSelectCliente($event){
        this.clientesProveedoresAreas = $event.value.areas;
        console.log(this.clientesProveedoresAreas);
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
        const recordId = values.idTarifario;

        if (this.isEdit) {
            this.tarifarioService.update(recordId, values).subscribe((data: Tarifario) => {

                // this.tarifarioService.setTarifarioChange(data);
                this.tarifarioService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });

                this.ref.close(data);
            });
        } else {
            this.tarifarioService.save(values).subscribe((data: Tarifario) => {
                // this.tarifarioNew = data;
                // this.tarifarioService.setTarifarioChange(data);
                this.tarifarioService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos creados correctamente',
                    life: 3000,
                });

                this.ref.close(data);
            });
        }

        // this.close();
    }

    close() {
        this.ref.close(this.tarifarioNew);
    }
}
