import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { map } from 'rxjs';
import { ClienteProveedor } from 'src/app/admin/models/cliente-proveedor';
import { ClienteProveedorDireccion } from 'src/app/admin/models/cliente-proveedor-direccion';
import { SunatTipoDocumentoIdentidad } from 'src/app/admin/models/sunat-tipo-documento-identidad';
import { TipoClienteProveedor } from 'src/app/admin/models/tipo-cliente-proveedor';

import { Ubigeo } from 'src/app/admin/models/ubigeo';
import { ApimigoService } from 'src/app/admin/services/apimigo.service';
import { ClienteProveedorService } from 'src/app/admin/services/cliente-proveedor.service';
import { SunatTipoDocumentoIdentidadService } from 'src/app/admin/services/sunat-tipo-documento-identidad.service';
import { TipoClienteProveedorService } from 'src/app/admin/services/tipo-cliente-proveedor.service';
import { UbigeoService } from 'src/app/admin/services/ubigeo.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-cliente-proveedor-form',
    templateUrl: './cliente-proveedor-form.component.html',
    styleUrls: ['./cliente-proveedor-form.component.scss'],
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule, NgIf],
})
export class ClienteProveedorFormComponent implements OnInit {
    clienteProveedor!: ClienteProveedor;
    form!: FormGroup;
    formDireccion!: FormGroup;
    title: string = 'Editar Cliente/Proveedor';
    isEdit: boolean = false;
    isEditDireccion: boolean = false;
    submitted = false;
    readOnlyID: boolean = false;
    ubigeosFiltrados = [];
    tiposDocumentosIdentidad: SunatTipoDocumentoIdentidad[];
    tiposClientesProveedores: TipoClienteProveedor[];
    activeIndex: number = 0;

    listaDirecciones: ClienteProveedorDireccion[];

    deleteClienteProveedorDireccionDialog: boolean = false;
    clienteProveedorDireccion: ClienteProveedorDireccion;

    constructor(
        private clienteProveedorService: ClienteProveedorService,
        private ubigeoService: UbigeoService,
        private sunatTipoDocumentoIdentidadService: SunatTipoDocumentoIdentidadService,
        private tipoClienteProveedorService: TipoClienteProveedorService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService,
        private apimigoService: ApimigoService
    ) {
        if (this.config.data) {
            this.title = 'EDITAR CLIENTE/PROVEEDOR';
            this.clienteProveedor = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;
            // this.agencia.ubigeo.nombreUbigeo = this.agencia.ubigeo.departamento + ' - ' + this.agencia.ubigeo.provincia + ' - ' + this.agencia.ubigeo.distrito;
        } else {
            this.title = 'NUEVO CLIENTE/PROVEEDOR';
            this.clienteProveedor = new ClienteProveedor();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.sunatTipoDocumentoIdentidadService.findAll().subscribe((data) => {
            this.tiposDocumentosIdentidad = data;
        });

        this.tipoClienteProveedorService.findAll().subscribe((data) => {
            this.tiposClientesProveedores = data;
        });

        this.form = new FormGroup({
            idClienteProveedor: new FormControl(
                this.clienteProveedor.idClienteProveedor
            ),
            tipoDocumentoIdentidad: new FormControl(this.clienteProveedor.tipoDocumentoIdentidad),
            numeroDocumentoIdentidad: new FormControl(this.clienteProveedor.numeroDocumentoIdentidad, [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(11),
            ]),
            nombreRazonSocial: new FormControl(this.clienteProveedor.nombreRazonSocial, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            telefono: new FormControl(this.clienteProveedor.telefono, [
                Validators.required,
                Validators.minLength(9),
            ]),
            correo: new FormControl(this.clienteProveedor.correo),
            tipoClienteProveedor: new FormControl(this.clienteProveedor.tipoClienteProveedor, Validators.required),
            activo: new FormControl(this.clienteProveedor.activo, Validators.required),
        });

        this.formDireccion = new FormGroup({
            idClienteProveedorDireccion: new FormControl(0),
            direccion: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(150),
            ]),
            ubigeo: new FormControl('', Validators.required),
        });

        this.listaDirecciones = this.clienteProveedor.direcciones;


    }
    get f() {
        return this.form.controls;
    }

    get fd() {
        return this.formDireccion.controls;
    }

    filtrarUbigeos(event: any) {
        this.ubigeoService.autocomplete(event.query).subscribe((result) => {
            this.ubigeosFiltrados = result;
        });
    }

    operateDireccion() {
        const clienteProveedorDireccion: ClienteProveedorDireccion =
            new ClienteProveedorDireccion();
        clienteProveedorDireccion.direccion =
            this.formDireccion.value['direccion'];
        clienteProveedorDireccion.ubigeo = this.formDireccion.value['ubigeo'];
        this.clienteProveedor.direcciones.push(clienteProveedorDireccion);
        this.clienteProveedorService
            .update(
                this.clienteProveedor.idClienteProveedor,
                this.clienteProveedor
            )
            .subscribe((data: ClienteProveedor) => {
                this.formDireccion.reset();
                this.listaDirecciones = data.direcciones;
            });
    }

    operateDireccionEdit() {
        const clienteProveedorDireccion: ClienteProveedorDireccion = new ClienteProveedorDireccion();
        clienteProveedorDireccion.idClienteProveedorDireccion =this.formDireccion.value['idClienteProveedorDireccion'];
        clienteProveedorDireccion.clienteProveedor = this.clienteProveedor;
        clienteProveedorDireccion.direccion =this.formDireccion.value['direccion'];
        clienteProveedorDireccion.ubigeo = this.formDireccion.value['ubigeo'];
        this.clienteProveedorService.updateDireccion(
                clienteProveedorDireccion.idClienteProveedorDireccion,
                clienteProveedorDireccion
            )
            .subscribe((data: ClienteProveedorDireccion) => {
                this.formDireccion.reset();
                this.isEditDireccion = false;
                this.loadClienteProveedor(this.clienteProveedor.idClienteProveedor);
            });
    }

    loadClienteProveedor(id: number) {
        this.clienteProveedorService
            .findById(this.clienteProveedor.idClienteProveedor)
            .subscribe((data) => {
                this.clienteProveedor = data;
                this.clienteProveedor.direcciones.map((d) => {
                    d.ubigeo.nombreUbigeo = `${d.ubigeo.distrito} - ${d.ubigeo.provincia} - ${d.ubigeo.departamento}`;
                });
                this.listaDirecciones = data.direcciones;
            });
    }

    editDireccion(clienteProveedorDireccion: ClienteProveedorDireccion) {
        this.isEditDireccion = true;
        this.formDireccion = new FormGroup({
            idClienteProveedorDireccion: new FormControl(
                clienteProveedorDireccion.idClienteProveedorDireccion
            ),
            direccion: new FormControl(clienteProveedorDireccion.direccion, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(150),
            ]),
            ubigeo: new FormControl(
                clienteProveedorDireccion.ubigeo,
                Validators.required
            ),
        });
    }

    deleteDireccion(clienteProveedorDireccion: ClienteProveedorDireccion) {
        console.log(clienteProveedorDireccion);
        this.deleteClienteProveedorDireccionDialog = true;
        this.clienteProveedorDireccion = { ...clienteProveedorDireccion };
    }

    confirmDeleteDireccion() {
        this.deleteClienteProveedorDireccionDialog = false;
        this.clienteProveedor.direcciones =
            this.clienteProveedor.direcciones.filter(
                (el: ClienteProveedorDireccion) =>
                    this.clienteProveedorDireccion
                        .idClienteProveedorDireccion !==
                    el.idClienteProveedorDireccion
            );
        this.clienteProveedorService
            .deleteDireccion(
                this.clienteProveedorDireccion.idClienteProveedorDireccion
            )
            .subscribe((resp) => {
                this.messageService.add({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Dirección eliminada con éxito',
                    life: 3000,
                });
                this.loadClienteProveedor(
                    this.clienteProveedor.idClienteProveedor
                );
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

        const clienteProveedorNew: ClienteProveedor = new ClienteProveedor();

        let direcciones: ClienteProveedorDireccion[] = [];
        const clienteProveedorDireccion: ClienteProveedorDireccion =
            new ClienteProveedorDireccion();

        clienteProveedorNew.idClienteProveedor = this.form.value['idClienteProveedor'];
        clienteProveedorNew.tipoDocumentoIdentidad = this.form.value['tipoDocumentoIdentidad'];
        clienteProveedorNew.numeroDocumentoIdentidad = this.form.value['numeroDocumentoIdentidad'];
        clienteProveedorNew.nombreRazonSocial = this.form.value['nombreRazonSocial'];
        clienteProveedorNew.telefono = this.form.value['telefono'];
        clienteProveedorNew.correo = this.form.value['correo'];
        clienteProveedorNew.tipoClienteProveedor = this.form.value['tipoClienteProveedor'];
        clienteProveedorNew.activo = this.form.value['activo'];

        this.clienteProveedorService
            .update(
                this.clienteProveedor.idClienteProveedor,
                clienteProveedorNew
            )
            .subscribe((data) => {
                this.clienteProveedorService.setClienteProveedorChange(data);
                this.clienteProveedorService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });

        this.close();
    }

    close() {
        this.ref.close();
    }

    buscarMigo() {
        this.clienteProveedorService
            .getByDniRuc(this.form.value['dniruc'])
            .subscribe((resp: any) => {
                if (resp == null) {
                    if (this.form.value['dniruc'].length == 8) {
                        this.apimigoService
                            .consultarDNI(this.form.value['dniruc'])
                            .then((resp) => {
                                this.form.controls[
                                    'nombreClienteProveedor'
                                ].setValue(resp.nombre);
                            });
                    } else if (this.form.value['dniruc'].length == 11) {
                        this.apimigoService
                            .consultarRUC(this.form.value['dniruc'])
                            .then((resp) => {
                                console.log(resp);

                                this.form.controls[
                                    'nombreClienteProveedor'
                                ].setValue(resp.nombre_o_razon_social);
                                this.form.controls['direccion'].setValue(
                                    resp.direccion_simple
                                );
                                this.ubigeoService
                                    .findById(resp.ubigeo)
                                    .subscribe((ubigeo: Ubigeo) => {
                                        ubigeo.nombreUbigeo = `${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`;
                                        this.form.controls['ubigeo'].setValue(
                                            ubigeo
                                        );
                                        // this.ubigeosFiltrados.push(ubigeo);
                                        // console.log(this.ubigeosFiltrados)
                                    });
                            });
                    } else {
                        this.clienteProveedorService.setMessageChange({
                            key: 'tc',
                            severity: 'info',
                            summary: 'Atención',
                            detail: 'Dato inválido',
                            life: 3000,
                        });
                    }
                } else {
                    this.clienteProveedorService.setMessageChange({
                        key: 'tc',
                        severity: 'info',
                        summary: 'Atención',
                        detail: 'Ya existe un Cliente / Proveedor registrado con este DNI/RUC',
                        life: 3000,
                    });
                }
            });
    }
}
