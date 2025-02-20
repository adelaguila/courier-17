import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
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
    clienteProveedorDireccion: ClienteProveedorDireccion;

    constructor(
        private clienteProveedorService: ClienteProveedorService,
        private ubigeoService: UbigeoService,
        private sunatTipoDocumentoIdentidadService: SunatTipoDocumentoIdentidadService,
        private tipoClienteProveedorService: TipoClienteProveedorService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public dialogService: DialogService,
        private apimigoService: ApimigoService
    ) {
        if (this.config.data) {
            this.title = 'EDITAR CLIENTE/PROVEEDOR';
            this.clienteProveedor = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;
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
            tipoDocumentoIdentidad: new FormControl(
                this.clienteProveedor.tipoDocumentoIdentidad
            ),
            numeroDocumentoIdentidad: new FormControl(
                this.clienteProveedor.numeroDocumentoIdentidad,
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(11),
                ]
            ),
            nombreRazonSocial: new FormControl(
                this.clienteProveedor.nombreRazonSocial,
                [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(100),
                ]
            ),
            telefono: new FormControl(this.clienteProveedor.telefono, [
                Validators.required,
                Validators.minLength(9),
            ]),
            correo: new FormControl(this.clienteProveedor.correo),
            tipoClienteProveedor: new FormControl(
                this.clienteProveedor.tipoClienteProveedor,
                Validators.required
            ),
            activo: new FormControl(
                this.clienteProveedor.activo,
                Validators.required
            ),
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
        if (this.isEdit) {
            this.clienteProveedorService
                .update(
                    this.clienteProveedor.idClienteProveedor,
                    this.clienteProveedor
                )
                .subscribe((data: ClienteProveedor) => {
                    this.formDireccion.reset();
                });
        } else {
            this.formDireccion.reset();
        }
    }

    operateDireccionEdit() {
        const clienteProveedorDireccion: ClienteProveedorDireccion =
            new ClienteProveedorDireccion();
        clienteProveedorDireccion.idClienteProveedorDireccion =
            this.formDireccion.value['idClienteProveedorDireccion'];
        clienteProveedorDireccion.clienteProveedor = this.clienteProveedor;
        clienteProveedorDireccion.direccion =
            this.formDireccion.value['direccion'];
        clienteProveedorDireccion.ubigeo = this.formDireccion.value['ubigeo'];
        this.clienteProveedorService
            .updateDireccion(
                clienteProveedorDireccion.idClienteProveedorDireccion,
                clienteProveedorDireccion
            )
            .subscribe((data: ClienteProveedorDireccion) => {
                this.formDireccion.reset();
                this.isEditDireccion = false;
                this.loadClienteProveedor(
                    this.clienteProveedor.idClienteProveedor
                );
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
            });
    }

    editDireccion(clienteProveedorDireccion: ClienteProveedorDireccion) {
        clienteProveedorDireccion.ubigeo.nombreUbigeo = `${clienteProveedorDireccion.ubigeo.distrito} - ${clienteProveedorDireccion.ubigeo.provincia} - ${clienteProveedorDireccion.ubigeo.departamento}`;
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

    deleteDireccion(clienteProveedorDireccion: ClienteProveedorDireccion, index: number) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Está seguro que desea eliminar la dirección?',
            header: 'Confirmar',
            icon: 'pi pi-question',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            acceptIcon: 'none',
            acceptLabel: 'SI, Eliminar',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                if (this.isEdit) {
                    this.clienteProveedorService
                        .deleteDireccion(
                            clienteProveedorDireccion.idClienteProveedorDireccion
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
                } else {
                    if (index !== -1) {
                        this.clienteProveedor.direcciones.splice(index, 1);
                    }
                }
            },
            reject: () => {},
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

        if (this.clienteProveedor.direcciones.length == 0) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'Falta registrar al menos una dirección',
                life: 3000,
            });

            return;
        }

        this.clienteProveedor.idClienteProveedor =
            this.form.value['idClienteProveedor'];
        this.clienteProveedor.tipoDocumentoIdentidad =
            this.form.value['tipoDocumentoIdentidad'];
        this.clienteProveedor.numeroDocumentoIdentidad =
            this.form.value['numeroDocumentoIdentidad'];
        this.clienteProveedor.nombreRazonSocial =
            this.form.value['nombreRazonSocial'];
        this.clienteProveedor.telefono = this.form.value['telefono'];
        this.clienteProveedor.correo = this.form.value['correo'];
        this.clienteProveedor.tipoClienteProveedor =
            this.form.value['tipoClienteProveedor'];
        this.clienteProveedor.activo = this.form.value['activo'];

        if (this.isEdit) {
            this.clienteProveedorService
                .update(
                    this.clienteProveedor.idClienteProveedor,
                    this.clienteProveedor
                )
                .subscribe((data) => {
                    this.clienteProveedorService.setClienteProveedorChange(
                        data
                    );
                    this.clienteProveedorService.setMessageChange({

                        severity: 'success',
                        summary: 'Success',
                        detail: 'Datos actualizados correctamente',
                        life: 3000,
                    });
                });
        } else {
            this.clienteProveedorService
                .save(this.clienteProveedor)
                .subscribe((data) => {
                    this.clienteProveedorService.setClienteProveedorChange(
                        data
                    );
                    this.clienteProveedorService.setMessageChange({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Datos guardados correctamente',
                        life: 3000,
                    });
                });
        }

        this.close();
    }

    close() {
        this.ref.close();
    }

    buscarMigo() {
        this.clienteProveedorService
            .getByDniRuc(this.form.value['numeroDocumentoIdentidad'])
            .subscribe((resp: any) => {
                console.log(
                    this.form.value['tipoDocumentoIdentidad']
                        .idSunatTipoDocumentoIdentidad
                );
                if (resp == null) {
                    if (
                        this.form.value['tipoDocumentoIdentidad']
                            .idSunatTipoDocumentoIdentidad == 1
                    ) {
                        this.apimigoService
                            .consultarDNI(
                                this.form.value['numeroDocumentoIdentidad']
                            )
                            .then((resp) => {
                                console.log(resp);
                                if (resp.success) {
                                    this.form.controls[
                                        'nombreRazonSocial'
                                    ].setValue(resp.nombre);
                                } else {
                                    this.clienteProveedorService.setMessageChange(
                                        {
                                            key: 'tc',
                                            severity: 'info',
                                            summary: 'Atención',
                                            detail: resp.message,
                                            life: 3000,
                                        }
                                    );
                                }
                            });
                    } else if (
                        this.form.value['tipoDocumentoIdentidad']
                            .idSunatTipoDocumentoIdentidad == 6
                    ) {
                        this.apimigoService
                            .consultarRUC(
                                this.form.value['numeroDocumentoIdentidad']
                            )
                            .then((resp) => {
                                if (resp.success) {
                                    this.form.controls[
                                        'nombreRazonSocial'
                                    ].setValue(resp.nombre_o_razon_social);

                                    this.ubigeoService
                                        .findCodigo(resp.ubigeo)
                                        .subscribe((ubigeo: Ubigeo) => {
                                            ubigeo.nombreUbigeo = `${ubigeo.distrito} - ${ubigeo.provincia} - ${ubigeo.departamento}`;

                                            const clienteProveedorDireccion: ClienteProveedorDireccion =
                                                new ClienteProveedorDireccion();
                                            clienteProveedorDireccion.direccion =
                                                resp.nombre_o_razon_social;
                                            clienteProveedorDireccion.ubigeo =
                                                ubigeo;
                                            this.clienteProveedor.direcciones.push(
                                                clienteProveedorDireccion
                                            );
                                        });
                                } else {
                                    this.clienteProveedorService.setMessageChange(
                                        {
                                            key: 'tc',
                                            severity: 'info',
                                            summary: 'Atención',
                                            detail: resp.message,
                                            life: 3000,
                                        }
                                    );
                                }
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
