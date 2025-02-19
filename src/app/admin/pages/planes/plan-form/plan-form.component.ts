import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Plan } from 'src/app/admin/models/plan';
import { PlanServicio } from 'src/app/admin/models/plan-servicio';
import { Servicio } from 'src/app/admin/models/servicio';
import { PlanServicioService } from 'src/app/admin/services/plan-servicio.service';
import { PlanService } from 'src/app/admin/services/plan.service';
import { ServicioService } from 'src/app/admin/services/servicio.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

interface UsaONU {
    code: number;
    name: string;
}

interface Estado {
    name: string;
    code: string;
}

@Component({
    selector: 'app-plan-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './plan-form.component.html',
    styleUrl: './plan-form.component.scss',
})
export class PlanFormComponent implements OnInit {
    plan: Plan;
    form: FormGroup;
    formServicio!: FormGroup;
    title: string = '';
    idEdit!: boolean;
    submitted = false;

    estados: Estado[] | undefined;
    usaOnus: UsaONU[] | undefined;

    servicios: Servicio[];
    planServicios: PlanServicio[] = [];
    readOnlyID: boolean = false;
    isEdit: boolean = false;

    activeIndex: number = 0;

    constructor(
        private planService: PlanService,
        private planServicioService: PlanServicioService,
        private servicioService: ServicioService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.estados = [
            { name: 'ACTIVO', code: 'A' },
            { name: 'DESACTIVADO', code: 'D' },
        ];
        this.usaOnus = [
            { code: 0, name: 'NO' },
            { code: 1, name: 'SI' },
        ];

        if (this.config.data) {
            this.title = 'EDITAR PLAN';
            this.plan = this.config.data;
            this.planServicios = this.plan.servicios;
            this.readOnlyID = false;
            this.isEdit = true;
        } else {
            this.title = 'NUEVO PLAN';
            this.plan = new Plan();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.servicioService
            .findAll()
            .subscribe((data) => (this.servicios = data));

        this.form = new FormGroup({
            idPlan: new FormControl(this.plan.idPlan),
            nombrePlan: new FormControl(this.plan.nombrePlan, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            precioDia: new FormControl(this.plan.precioDia, [
                Validators.required,
            ]),
            precioMes: new FormControl(this.plan.precioMes, [
                Validators.required,
            ]),
            estado: new FormControl(this.plan?.estado, [Validators.required]),
            usaOnu: new FormControl(this.plan?.usaOnu, [Validators.required]),
        });

        this.formServicio = new FormGroup({
            idPlanServicio: new FormControl(0),
            servicio: new FormControl('', [Validators.required]),
            precioDia: new FormControl('', [Validators.required]),
            precioMes: new FormControl('', [Validators.required]),
        });

        setTimeout(() => {
            const estadoValue = this.form.controls['estado'].value;
            this.form.controls['estado'].setValue('');
            this.form.controls['estado'].setValue(estadoValue);

            const usaOnuValue = this.form.controls['usaOnu'].value;
            this.form.controls['usaOnu'].setValue('');
            this.form.controls['usaOnu'].setValue(usaOnuValue);
        });
    }
    get f() {
        return this.form.controls;
    }

    get fs() {
        return this.formServicio.controls;
    }

    operate() {
        if (this.form.invalid) {
            this.messageService.add({
                // key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'El formulario es inválido',
                life: 3000,
            });

            return;
        }

        if (this.planServicios.length == 0) {
            this.messageService.add({
                // key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'Flata agregar los servicios para el plan',
                life: 3000,
            });

            return;
        }


        const values = this.form.value;
        const recordId = values.idPlan;

        let pdia = 0;
        let pmes = 0;
        this.planServicios.map((e) => {
            pdia += +e.precioDia;
            pmes += +e.precioMes;
        });
        this.plan = { ...values };
        this.plan.precioDia = pdia;
        this.plan.precioMes = pmes;
        this.plan.servicios = this.planServicios;

        if (this.isEdit) {
            this.planService.update(recordId, this.plan).subscribe((data) => {
                this.planService.setPlanChange(data);
                this.planService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.planService.save(this.plan).subscribe((data) => {
                this.planService.setPlanChange(data);
                this.planService.setMessageChange({
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

    agregarServicio() {
        const values = this.formServicio.value;

        let existe = this.planServicios.filter(
            (element) =>
                element.servicio.idServicio == values.servicio.idServicio
        );
        if (existe.length > 0) {
            this.messageService.add({
                // key: 'tc',
                severity: 'info',
                summary: 'Info',
                detail: 'El servicio ya está registrado',
                life: 3000,
            });

            return;
        } else {
            this.planServicios.push(values);
            this.formServicio.reset();

            let pdia = 0;
            let pmes = 0;
            this.planServicios.map((e) => {
                pdia += +e.precioDia;
                pmes += +e.precioMes;
            });

            this.plan.precioDia = pdia;
            this.plan.precioMes = pmes;
        }
    }

    deleteServicio(row: PlanServicio) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Está seguro que desea eliminar el registro?',
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            acceptIcon: 'none',
            acceptLabel: 'SI, Eliminar',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                if (row.idPlanServicio > 0) {
                    this.planServicioService
                        .delete(row.idPlanServicio)
                        .subscribe((data) => {
                            let indice = this.planServicios.indexOf(row);
                            this.planServicios.splice(indice, 1);
                        });
                } else {
                    let indice = this.planServicios.indexOf(row);
                    this.planServicios.splice(indice, 1);
                }

                let pdia = 0;
                let pmes = 0;
                this.planServicios.map((e) => {
                    pdia += +e.precioDia;
                    pmes += +e.precioMes;
                });
                this.plan.precioDia = pdia;
                this.plan.precioMes = pmes;
            },
            reject: () => {},
        });
    }
}
