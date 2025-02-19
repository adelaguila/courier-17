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
import { User } from "src/app/admin/models/user";
import { AbonadoService } from "src/app/admin/services/abonado.service";
import { OrdenService } from "src/app/admin/services/orden.service";
import { UserService } from "src/app/admin/services/user.service";
import { PrimengModule } from "src/app/primeng/primeng.module";
import { OrdenAsignarVariosDTO } from '../../../dto/orden-asignar-varios';


@Component({
    selector: "app-asignar-varios-dialog",
    templateUrl: "./asignar-varios-dialog.component.html",
    styleUrls: ["./asignar-varios-dialog.component.scss"],
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule, RouterLink, NgIf],
    providers: [DialogService, MessageService],
})
export class AsignarVariosDialogComponent implements OnInit {
    ordenesSeleccionadas!: Orden[];
    form!: FormGroup;
    title: string = "Asignar Orden";
    submitted = false;
    usuarios: User[] | undefined;
    today = new Date();
    fecha: any;
    pipe = new DatePipe("en-US");
    nombreTipoOrden: string;
    nombreTercero: string;
    direccion: string;

    devuelto: any;

    constructor(
        private ordenService: OrdenService,
        private userService: UserService,
        public ref: DynamicDialogRef,
        private cd: ChangeDetectorRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {}
    ngOnInit(): void {
        this.userService.findAll().subscribe((data) => (this.usuarios = data));

        if (this.config.data) {
            this.ordenesSeleccionadas = this.config.data;
        }

        this.fecha = this.pipe.transform(this.today, "YYYY-MM-dd");

        this.form = new FormGroup({
            user: new FormControl([Validators.required]),
            fecha: new FormControl(this.fecha, [
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

        const ordenAsignarVariosDTO: OrdenAsignarVariosDTO = new OrdenAsignarVariosDTO();
        ordenAsignarVariosDTO.user = this.form.value["user"];
        ordenAsignarVariosDTO.fecha = this.form.value["fecha"];
        ordenAsignarVariosDTO.ordenes = this.ordenesSeleccionadas;

        this.ordenService.asignarVarios(ordenAsignarVariosDTO).subscribe((data) => {
            this.ordenService.setOrdenChange(data);
            // this.abonadoService.setOrdenChange(this.orden.abonado.idAbonado);
            this.ordenService.setMessageChange({
                // key: "tc",
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
