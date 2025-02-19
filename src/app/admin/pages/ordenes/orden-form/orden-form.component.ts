import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Abonado } from 'src/app/admin/models/abonado';
import { Orden } from 'src/app/admin/models/orden';
import { Plan } from 'src/app/admin/models/plan';
import { TipoOrden } from 'src/app/admin/models/tipo-orden';
import { AbonadoService } from 'src/app/admin/services/abonado.service';
import { OrdenService } from 'src/app/admin/services/orden.service';
import { PlanService } from 'src/app/admin/services/plan.service';
import { TipoOrdenService } from 'src/app/admin/services/tipo-orden.service';
import { UserService } from 'src/app/admin/services/user.service';


import { PrimengModule } from 'src/app/primeng/primeng.module';
import { Vendedor } from 'src/app/shared/interfaces/vendedor';
import { map } from 'rxjs';

@Component({
    selector: 'app-orden-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './orden-form.component.html',
    styleUrl: './orden-form.component.scss',
})
export class OrdenFormComponent implements OnInit {
    orden: Orden;
    abonado!: Abonado;
    form: FormGroup;
    title: string = '';
    submitted = false;

    tiposOrden: TipoOrden[] | undefined;
    today = new Date();
    fechaRegistro: any;
    pipe = new DatePipe("en-US");

    vendedores: Vendedor[] | undefined = [];
    planes: Plan[] | undefined;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    changeTipoOrden: TipoOrden = new TipoOrden();
    mostrarPlanVendedor: boolean = false;
    mostrarDetalle: boolean = false;

    constructor(
        private ordenService: OrdenService,
        private tipoOrdenService: TipoOrdenService,
        private abonadoService: AbonadoService,
        private userService: UserService,
        private planService: PlanService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR ORDEN';
            this.orden = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO ORDEN';
            this.orden = new Orden();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.userService
        .findAll()
        .pipe(
            map((value) =>
                value.sort((a, b) => {
                    if (a.name < b.name) {
                        return -1;
                    } else {
                        return 1;
                    }
                })
            )
        )
        .subscribe((data) => {
            data.map((e) => {
                let vendedor: Vendedor = {
                    code: e.idUser,
                    name: e.name,
                };
                this.vendedores.push(vendedor);
            });
        });

        this.planService.findAll().subscribe((data) => (this.planes = data));

        if (this.config.data.idOrden) {
            this.orden = this.config.data.orden;
            this.isEdit = this.orden != null;
            this.abonado = this.config.data.abonado;
            // this.initForm();
        }else{
            this.abonado = this.config.data;
        }

        this.tipoOrdenService.getUsoEstadoAbonado(this.abonado.estado).subscribe((data) => (this.tiposOrden = data));

        this.fechaRegistro = this.pipe.transform(this.today, "YYYY-MM-dd");

        this.form = new FormGroup({
            idOrden: new FormControl(this.orden?.idOrden),
            tipoOrden: new FormControl(this.orden?.tipoOrden, [
                Validators.required
            ]),
            plan: new FormControl(this.orden?.plan, [
                Validators.required
            ]),
            vendedor: new FormControl(this.orden?.vendedor, [
                Validators.required
            ]),
            detalle: new FormControl(this.orden?.detalle),
            estado: new FormControl("REGISTRADO", [
                Validators.required,
            ]),
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

        const ordenNew: Orden = new Orden();
        ordenNew.idOrden = this.form.value["idOrden"];
        ordenNew.abonado = this.abonado;
        ordenNew.tipoOrden = this.form.value["tipoOrden"];
        ordenNew.fechaRegistro = this.form.value["fechaRegistro"];
        ordenNew.detalle = this.form.value["detalle"];
        ordenNew.estado = this.form.value["estado"];
        if(ordenNew.tipoOrden.comision == 1){
            ordenNew.plan = this.form.value["plan"];
            ordenNew.vendedor = this.form.value["vendedor"];
        }

        if(ordenNew.tipoOrden.idTipoOrden == 6){
            ordenNew.detalle = `${this.abonado.plan.nombrePlan} ==> ${ordenNew.plan.nombrePlan}`
        }


        if (this.isEdit) {
            this.ordenService
                .update(this.orden.idOrden, ordenNew)
                .subscribe((data) => {
                    this.ordenService.setOrdenChange(data);
                    this.abonadoService.setOrdenChange(this.abonado.idAbonado);
                    this.ordenService.setMessageChange({
                        key: "tc",
                        severity: "success",
                        summary: "Success",
                        detail: "Datos actualizados correctamente",
                        life: 3000,
                    });
                });
        } else {
            this.ordenService.save(ordenNew).subscribe((data) => {
                this.ordenService.setOrdenChange(data);
                this.abonadoService.setOrdenChange(this.abonado.idAbonado);
                this.ordenService.setMessageChange({
                    key: "tc",
                    severity: "success",
                    summary: "Success",
                    detail: "Datos creados correctamente",
                    life: 3000,
                });
            });
        }

        this.close();
    }

    close() {
        this.ref.close();
    }

    cambiarTipoOrden(envet) {
        this.changeTipoOrden = this.form.value["tipoOrden"];

        if(this.changeTipoOrden.idTipoOrden == 6){
            this.mostrarDetalle = false;
        }else{
            this.mostrarDetalle = true;
        }


        if (this.changeTipoOrden.comision == 1) {
            this.mostrarPlanVendedor = true;
        } else {
            this.mostrarPlanVendedor = false;
        }
    }
}
