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
import { Abonado } from "src/app/admin/models/abonado";
import { Cargo } from "src/app/admin/models/cargo";
import { TipoCargo } from "src/app/admin/models/tipo-cargo";
import { AbonadoService } from "src/app/admin/services/abonado.service";
import { CargoService } from "src/app/admin/services/cargo.service";
import { TipoCargoService } from "src/app/admin/services/tipo-cargo.service";
import { PrimengModule } from "src/app/primeng/primeng.module";


interface Mes {
    code: string;
    name: string;
}

@Component({
    selector: "app-abonado-cargo",
    templateUrl: "./abonado-cargo.component.html",
    styleUrls: ["./abonado-cargo.component.scss"],
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule, RouterLink, NgIf],
    providers: [DialogService, MessageService],
})
export class AbonadoCargoComponent implements OnInit {
    abonado!: Abonado;
    form!: FormGroup;
    title: string = "Registrar Cargo";
    submitted = false;
    tiposCargos: TipoCargo[] | undefined;
    today = new Date();
    fechaEmision: any;
    fechaInicio: any;
    fechaFin: any;
    fechaVencimiento: any;
    anio: any;
    pipe = new DatePipe("en-US");

    isEdit!: boolean;

    meses: Mes[] | undefined;

    changeTipoCargo: TipoCargo = new TipoCargo();
    mostrarGlosa: boolean = false;

    constructor(
        private abonadoService: AbonadoService,
        private cargoService: CargoService,
        private tipoCargoService: TipoCargoService,
        public ref: DynamicDialogRef,
        private cd: ChangeDetectorRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.abonado = this.config.data;
        this.abonado.tercero.dnirucNombreTercero = `${this.abonado.tercero.dniruc} - ${this.abonado.tercero.nombreTercero}`;

        this.tipoCargoService
            .findAll()
            .subscribe((data) => (this.tiposCargos = data));

        this.meses = [
            { code: "01", name: "ENERO" },
            { code: "02", name: "FEBRERO" },
            { code: "03", name: "MARZO" },
            { code: "04", name: "ABRIL" },
            { code: "05", name: "MAYO" },
            { code: "06", name: "JUNIO" },
            { code: "07", name: "JUNIO" },
            { code: "08", name: "AGOSTO" },
            { code: "09", name: "SETIEMBRE" },
            { code: "10", name: "OCTUBRE" },
            { code: "11", name: "NOVIEMBRE" },
            { code: "12", name: "DICIEMBRE" },
        ];

        this.fechaEmision = this.pipe.transform(this.today, "YYYY-MM-dd");
        this.fechaInicio = this.pipe.transform(this.today, "YYYY-MM-dd");
        this.fechaFin = this.pipe.transform(this.today, "YYYY-MM-dd");
        this.fechaVencimiento = this.pipe.transform(this.today, "YYYY-MM-dd");
        this.anio = this.pipe.transform(this.today, "YYYY");

        this.form = new FormGroup({
            idCargo: new FormControl(0),
            tipoCargo: new FormControl("", [Validators.required]),
            fechaEmision: new FormControl(this.fechaEmision, [
                Validators.required,
            ]),
            fechaInicio: new FormControl(this.fechaInicio, [
                Validators.required,
            ]),
            fechaFin: new FormControl(this.fechaFin, [Validators.required]),
            fechaVencimiento: new FormControl(this.fechaVencimiento, [
                Validators.required,
            ]),
            anio: new FormControl(this.anio, [Validators.required]),
            mes: new FormControl(""),
            glosa: new FormControl(""),
            cantidad: new FormControl(""),
            precio: new FormControl(""),
            total: new FormControl(""),
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

        const cargoNew: Cargo = new Cargo();
        cargoNew.idCargo = this.form.value["idCargo"];
        cargoNew.abonado = this.abonado;
        cargoNew.tipoCargo = this.form.value["tipoCargo"];
        cargoNew.fechaEmision = this.form.value["fechaEmision"];
        if (cargoNew.tipoCargo.idTipoCargo == 1) {  //esto es mensualidad
            cargoNew.glosa = cargoNew.tipoCargo.nombreTipoCargo;
            cargoNew.fechaInicio = this.form.value["fechaInicio"];
            cargoNew.fechaFin = this.form.value["fechaFin"];
            cargoNew.fechaVencimiento = this.form.value["fechaVencimiento"];
            cargoNew.anio = this.form.value["anio"];
            cargoNew.periodo = `${this.form.value["anio"]}${this.form.value["mes"]}`;
            cargoNew.cantidad = 1;
            cargoNew.precio = 1;
            cargoNew.total = 1;
        } else {
            cargoNew.fechaInicio = this.form.value["fechaEmision"];
            cargoNew.fechaFin = this.form.value["fechaEmision"];
            cargoNew.fechaVencimiento = this.form.value["fechaEmision"];
            cargoNew.anio = +this.pipe.transform(this.form.value["fechaEmision"],"YYYY");
            cargoNew.periodo = `${this.pipe.transform(this.form.value["fechaEmision"],"YYYY")}${this.pipe.transform(this.form.value["fechaEmision"],"MM")}`;

            if (cargoNew.tipoCargo.precio > 0) {
                cargoNew.glosa = cargoNew.tipoCargo.nombreTipoCargo;
                cargoNew.cantidad = 1;
                cargoNew.precio = cargoNew.tipoCargo.precio;
                cargoNew.total = cargoNew.precio;
            } else {
                cargoNew.glosa = this.form.value["glosa"];
                cargoNew.cantidad = 1;
                cargoNew.precio = this.form.value["total"];
                cargoNew.total = this.form.value["total"];
            }
        }

        if (cargoNew.total > 0) {
            this.cargoService.save(cargoNew).subscribe((data) => {
                this.cargoService.setOrdenChange(data);
                this.abonadoService.setOrdenChange(this.abonado.idAbonado);
                this.cargoService.setMessageChange({
                    key: "tc",
                    severity: "success",
                    summary: "Success",
                    detail: "Datos registrados correctamente",
                    life: 3000,
                });
            });
        } else {
            this.messageService.add({
                key: "tc",
                severity: "info",
                summary: "Total Inválido",
                detail: "El total pagado debe ser mayo a 0",
                life: 3000,
            });
            return;
        }

        this.close();
    }

    close() {
        this.ref.close(this.abonado);
    }

    cambiarTipoCargo(envet) {
        this.changeTipoCargo = this.form.value["tipoCargo"];
        if (
            this.changeTipoCargo.idTipoCargo > 1 &&
            this.changeTipoCargo.precio == 0
        ) {
            this.mostrarGlosa = true;
        } else {
            this.mostrarGlosa = false;
        }
        console.log(this.changeTipoCargo);
    }
}
