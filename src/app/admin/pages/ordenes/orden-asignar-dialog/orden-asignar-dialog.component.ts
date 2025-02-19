import { DatePipe, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MessageService } from "primeng/api";
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from "primeng/dynamicdialog";
import { Orden } from "src/app/admin/models/orden";
import { OrdenAsignacion } from "src/app/admin/models/orden-asignacion";
import { User } from "src/app/admin/models/user";
import { AbonadoService } from "src/app/admin/services/abonado.service";
import { OrdenService } from "src/app/admin/services/orden.service";
import { UserService } from "src/app/admin/services/user.service";
import { PrimengModule } from "src/app/primeng/primeng.module";


@Component({
    selector: "app-orden-asignar-dialog",
    templateUrl: "./orden-asignar-dialog.component.html",
    styleUrls: ["./orden-asignar-dialog.component.scss"],
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule, RouterLink, NgIf],
    providers: [DialogService, MessageService],
})
export class OrdenAsignarDialogComponent implements OnInit {
    orden!: Orden;
    form!: FormGroup;
    title: string = "Asignar Orden";
    submitted = false;
    usuarios: User[] | undefined;
    today = new Date();
    fechaAsingacion: any;
    pipe = new DatePipe("en-US");
    nombreTipoOrden: string;
    nombreTercero: string;
    direccion: string;

    devuelto: any;

    constructor(
        private ordenService: OrdenService,
        private userService: UserService,
        private abonadoService: AbonadoService,
        public ref: DynamicDialogRef,
        private cd: ChangeDetectorRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        this.userService.findAll().subscribe((data) => (this.usuarios = data));

        if (this.config.data) {
            this.orden = this.config.data;
            this.nombreTipoOrden = this.config.data.tipoOrden.nombreTipoOrden;
            this.nombreTercero = this.config.data.abonado.tercero.nombreTercero;
            this.direccion = `${this.config.data.abonado.via.tipoVia.idTipoVia}.${this.config.data.abonado.via.nombreVia} ${this.config.data.abonado.numero}  - ${this.config.data.abonado.sector.nombreSector}`;
        }

        this.fechaAsingacion = this.pipe.transform(this.today, "YYYY-MM-dd");

        this.form = new FormGroup({
            idOrdenAsignacion: new FormControl(0, [Validators.required]),
            orden: new FormControl(this.orden, [Validators.required]),
            user: new FormControl([Validators.required]),
            fechaAsignacion: new FormControl(this.fechaAsingacion, [
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
                key: "tc",
                severity: "error",
                summary: "Error",
                detail: "El formulario es inválido",
                life: 3000,
            });

            return;
        }

        const ordenAsignacionNew: OrdenAsignacion = new OrdenAsignacion();
        ordenAsignacionNew.idOrdenAsignacion =
            this.form.value["idOrdenAsignacion"];
        ordenAsignacionNew.orden = this.orden;
        ordenAsignacionNew.user = this.form.value["user"];
        ordenAsignacionNew.fechaAsignacion = this.form.value["fechaAsignacion"];

        this.ordenService.asignarOrden(ordenAsignacionNew).subscribe((data) => {
            this.ordenService.setOrdenChange(data);
            this.abonadoService.setOrdenChange(this.orden.abonado.idAbonado);
            this.ordenService.setMessageChange({
                key: "tc",
                severity: "success",
                summary: "Success",
                detail: "Datos creados correctamente",
                life: 3000,
            });

            this.close();
        });


    }

    close() {
        this.ref.close();
    }
}
