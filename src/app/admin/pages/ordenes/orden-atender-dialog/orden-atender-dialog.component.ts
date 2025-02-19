import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Orden } from 'src/app/admin/models/orden';
import { OrdenAsignacion } from 'src/app/admin/models/orden-asignacion';
import { PrimengModule } from 'src/app/primeng/primeng.module';

import { OrdenAsignacionOnt } from 'src/app/admin/models/orden-asignacion-ont';
import { OrdenAsignacionProducto } from 'src/app/admin/models/orden-asignacion-producto';
import { OrdenService } from 'src/app/admin/services/orden.service';
import { OrdenAsignacionService } from 'src/app/admin/services/orden-asignacion.service';
import { AbonadoService } from 'src/app/admin/services/abonado.service';
import { OntUser } from 'src/app/admin/models/ont-user';
import { ProductoEmpleado } from 'src/app/admin/models/producto-empleado';
import { ProductoService } from 'src/app/admin/services/producto.service';
import { OntService } from 'src/app/admin/services/ont.service';
import { OntUserService } from 'src/app/admin/services/ont-user.service';
import { ProductoEmpleadoService } from 'src/app/admin/services/producto-empleado.service';



@Component({
  selector: 'app-orden-atender-dialog',
  templateUrl: './orden-atender-dialog.component.html',
  styleUrls: ['./orden-atender-dialog.component.scss'],
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, RouterLink, NgIf],
  providers: [DialogService, MessageService],
})
export class OrdenAtenderDialogComponent implements OnInit {

    orden!: Orden;
    ordenAsignacion!: OrdenAsignacion;
    form!: FormGroup;
    title: string = "Atender Orden";
    submitted = false;
    today = new Date();
    fechaAtencion: any;
    pipe = new DatePipe("en-US");
    nombreTipoOrden: string;
    nombreTercero: string;
    direccion: string;
    idOrdenAsignacion:number = 0;

    productosFiltrados = [];

    onts: OntUser[] = [];
    productosEmpleados: ProductoEmpleado[] = [];
    ontUser: OntUser | null = null;

    ontsUtilizados: OrdenAsignacionOnt[] = [];
    productosUtilizados: OrdenAsignacionProducto[] = [];
    producto: ProductoEmpleado | null = null;
    cantidad: number = 1;

    constructor(
        private ordenService: OrdenService,
        private ordenAsignacionService: OrdenAsignacionService,
        private abonadoService: AbonadoService,
        private productoService: ProductoService,
        private ontService: OntService,
        private ontUserService: OntUserService,
        private productoEmpleadoService: ProductoEmpleadoService,
        public ref: DynamicDialogRef,
        private cd: ChangeDetectorRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {

        if (this.config.data) {
            this.orden = this.config.data;
            this.nombreTipoOrden = `${this.config.data.tipoOrden.nombreTipoOrden} - ${this.config.data.detalle}`;
            this.nombreTercero = this.config.data.abonado.tercero.nombreTercero;
            this.direccion = `${this.config.data.abonado.via.tipoVia.idTipoVia}. ${this.config.data.abonado.via.nombreVia} ${this.config.data.abonado.numero} - ${this.config.data.abonado.sector.nombreSector}`;
            this.ordenAsignacionService.findOrdenAsignacionActiva(this.orden.idOrden).subscribe((data: OrdenAsignacion) => {
                this.ordenAsignacion = data
                this.idOrdenAsignacion = data.idOrdenAsignacion;

                this.productoEmpleadoService.getByEmpleadoInsumos(data.user.idUser).subscribe((data) => (this.productosEmpleados = data));

                this.ontUserService.getByEstadoUser('DISPONIBLE', data.user.idUser).subscribe((data) => {
                    this.onts = data;
                    this.form = new FormGroup({
                        idOrdenAsignacion: new FormControl(this.idOrdenAsignacion, [Validators.required]),
                        fechaAtencion: new FormControl(this.fechaAtencion, [
                            Validators.required,
                        ]),
                        reporte: new FormControl("", [
                            Validators.required,
                        ]),
                        ont: new FormControl(this.ontUser),
                        producto: new FormControl(this.producto),
                        cantidad: new FormControl(this.cantidad),
                    });
                } );

            });
        }

        this.fechaAtencion = this.pipe.transform(this.today, "YYYY-MM-dd");

        this.form = new FormGroup({
            idOrdenAsignacion: new FormControl(this.idOrdenAsignacion, [Validators.required]),
            fechaAtencion: new FormControl(this.fechaAtencion, [
                Validators.required,
            ]),
            reporte: new FormControl("", [
                Validators.required,
            ]),
            ont: new FormControl(""),
            producto: new FormControl(this.producto),

            cantidad: new FormControl(this.cantidad),
        });
    }

    get f() {
        return this.form.controls;
    }

    operate() {
        if (this.form.invalid) {
            this.messageService.add({
                key: "tc",
                severity: "error",
                summary: "Error",
                detail: "El formulario es inválido",
                life: 3000,
            });

            return;
        }

        this.ordenAsignacion.fechaAtencion = this.form.value["fechaAtencion"];
        this.ordenAsignacion.reporte = this.form.value["reporte"];
        this.ordenAsignacion.productosUtilizados = this.productosUtilizados;

        this.ontUser = this.form.value["ont"];

        if(this.ontUser){
            let ontUsado: OrdenAsignacionOnt = new OrdenAsignacionOnt();
            ontUsado.ont = this.ontUser.ont;
            ontUsado.estado = "ACTIVO";
            this.ontsUtilizados.push(ontUsado);
        }

        this.ordenAsignacion.onts = this.ontsUtilizados;

        if (this.orden.tipoOrden.idTipoOrden == 1 && this.orden.plan.usaOnu == 1 && this.ontUser == null) {
            this.messageService.add({
                key: "tc",
                severity: "info",
                summary: "¡ATENCIÓN!",
                detail: "Debe seleccionar una ONU para completar el proceso",
                life: 3000,
            });

            return;
        }

        this.ordenService.atenderOrden(this.ordenAsignacion).subscribe((data) => {
            this.ordenService.setOrdenChange(data);
            this.abonadoService.setOrdenChange(this.orden.abonado.idAbonado);
            this.ordenService.setMessageChange({
                key: "tc",
                severity: "success",
                summary: "Success",
                detail: "Datos creados correctamente",
                life: 3000,
            });
        });

        this.close();
    }

    filtrarProductos(event: any) {
        this.productoService.autocomplete(event.query).subscribe((result) => {
            this.productosFiltrados = result;
        });
    }

    agregarProducto(){
        this.producto = this.form.value["producto"];
        this.cantidad = this.form.value["cantidad"];
        if (this.producto == null || !this.producto) {
            this.messageService.add({
                key: "tc",
                severity: "error",
                summary: "Error",
                detail: "Debe ingresar un producto válido",
                life: 3000,
            });
            return;
        }
        if (this.cantidad <= 0 ) {
            this.messageService.add({
                key: "tc",
                severity: "error",
                summary: "Error",
                detail: "Debe ingresar una cantidad mayor a cero",
                life: 3000,
            });
            return;
        }

        let productoUsado: OrdenAsignacionProducto = new OrdenAsignacionProducto();
        productoUsado.producto = this.producto.producto;
        productoUsado.cantidad = this.cantidad;
        this.productosUtilizados.push(productoUsado);
        this.form.controls['producto'].setValue(null);
        this.form.controls['cantidad'].setValue(1);
    }

    quitarProducto(productoUtilizado: OrdenAsignacionProducto){}

    close() {
        this.ref.close();
    }

}
