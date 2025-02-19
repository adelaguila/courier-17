import { NgIf } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MessageService } from "primeng/api";
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from "primeng/dynamicdialog";
import { Ont } from "src/app/admin/models/ont";
import { OntService } from "src/app/admin/services/ont.service";
import { PrimengModule } from "src/app/primeng/primeng.module";

@Component({
    selector: "app-add-series",
    templateUrl: "./add-series.component.html",
    styleUrls: ["./add-series.component.scss"],
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule, RouterLink, NgIf],
    providers: [DialogService, MessageService],
})
export class AddSeriesComponent implements OnInit, AfterViewInit {
    ont: Ont;
    form!: FormGroup;
    title: string = "AGREGAR SERIES";
    series: string[] = [];
    serie: string = "";
    proceso: string = "";
    @ViewChild("inputSerie", {}) inputSerie: ElementRef;

    constructor(
        private ontService: OntService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        if (this.config.data) {
            this.proceso = this.config.data;
        }

        this.form = new FormGroup({
            serie: new FormControl(""),
        });
        // this.inputSerie.nativeElement.focus();
    }
    get f() {
        return this.form.controls;
    }

    enter(event) {
        this.addSerie();
    }

    addSerie() {
        this.serie = this.form.value["serie"];
        if (this.serie == null || this.serie == "") {
            this.messageService.add({
                key: "tc",
                severity: "error",
                summary: "Error",
                detail: "Debe ingresar una serie válida",
                life: 3000,
            });

            return;
        }

        const existe = this.series.find((element) => element == this.serie);

        if (existe) {
            this.messageService.add({
                key: "tc",
                severity: "error",
                summary: "Error",
                detail: `La serie ${existe} ya esta registrada`,
                life: 3000,
            });

            this.form.controls["serie"].setValue("");
            this.inputSerie.nativeElement.focus();
            return;
        }

        this.ontService.getBySerie(this.serie).subscribe((data: Ont) => {
            if (this.proceso == "INGRESO") {
                if (data == null) {
                    this.series.push(this.serie);
                    this.form.controls["serie"].setValue("");
                    this.inputSerie.nativeElement.focus();
                } else {
                    this.messageService.add({
                        key: "tc",
                        severity: "error",
                        summary: "Error",
                        detail: "El formulario es inválido",
                        life: 3000,
                    });

                    return;
                }
            }
            if (this.proceso == "SALIDA") {
                if (data == null) {
                    this.messageService.add({
                        key: "tc",
                        severity: "error",
                        summary: "Error",
                        detail: "La serie no es válida",
                        life: 3000,
                    });

                    return;
                }

                if (data.estado !== "DISPONIBLE") {
                    this.messageService.add({
                        key: "tc",
                        severity: "error",
                        summary: "Error",
                        detail: "La serie no está disponible",
                        life: 3000,
                    });

                    return;
                }

                this.series.push(this.serie);
                this.form.controls["serie"].setValue("");
                this.inputSerie.nativeElement.focus();
            }
        });
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

        // this.ontService.getBySerie(this.serie).subscribe((data: any) => {
        // if (data) {
        //     this.messageService.add({
        //         key: "tc",
        //         severity: "error",
        //         summary: "Error",
        //         detail: "El formulario es inválido",
        //         life: 3000,
        //     });

        //     return;
        // }
        // });

        this.close();
    }

    deleteItem(i: number) {
        console.log(i);
        this.series.splice(i, 1);

        // this.deleteTerceroDireccionDialog = true;
        // this.terceroDireccion = { ...terceroDireccion };
    }

    close() {
        this.ref.close(this.series);
    }

    ngAfterViewInit() {
        this.inputSerie.nativeElement.focus();
    }
}
