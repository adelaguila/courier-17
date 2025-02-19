import { Component, OnInit, ViewChild } from '@angular/core';
import {
    ConfirmationService,
    FilterMatchMode,
    LazyLoadEvent,
    MessageService,
    SelectItem,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UtilsService } from 'src/app/helpers/service/utils.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { UsuarioImportarComponent } from './usuario-importar/usuario-importar.component';


@Component({
    templateUrl: './usuario.component.html',
    providers: [MessageService, ConfirmationService, DialogService],
})
export class UsuarioComponent implements OnInit {
    @ViewChild('dt') table: Table;

    usuarios: User[] = [];

    usuario: User;
    submitted: boolean = false;
    cols: any[] = [];
    rowsPerPageOptions = [10, 20, 30, 40, 50];
    loading: boolean = false;
    totalRecords!: number;
    rows = 10;
    currentPage = 1;
    _filterPage: any = '';
    sortField: string;
    sortOrder: string;
    matchModeOptionsText: SelectItem[];
    matchModeOptionsNumber: SelectItem[];

    ref: DynamicDialogRef | undefined;

    deleteUserDialog: boolean = false;

    constructor(
        private usuarioService: UserService,
        private messageService: MessageService,
        private util: UtilsService,
        private confirmationService: ConfirmationService,
        private layoutService: LayoutService,
        public dialogService: DialogService
    ) {}

    ngOnInit() {
        this.usuarioService.getUserChange().subscribe((data) => {
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });

        this.usuarioService.getMessageChange().subscribe((data) => {
            this.messageService.add(data);
        });

        this.cols = [
            { field: "idUser", header: "ID" },
            { field: "username", header: "Username" },
            { field: "name", header: "Nombre" },
            { field: "enabled", header: "Activo" },
        ];

        this.matchModeOptionsText = [
            { label: 'Comienza con', value: FilterMatchMode.STARTS_WITH },
            { label: 'Termina con', value: FilterMatchMode.ENDS_WITH },
            { label: 'Contiene', value: FilterMatchMode.CONTAINS },
            { label: 'No contiene', value: FilterMatchMode.NOT_CONTAINS },
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
            { label: 'No es igual', value: FilterMatchMode.NOT_EQUALS },
        ];
        this.matchModeOptionsNumber = [
            { label: 'Es igual', value: FilterMatchMode.EQUALS },
            { label: 'No es igual', value: FilterMatchMode.NOT_EQUALS },
            { label: 'Menor que', value: FilterMatchMode.LESS_THAN },
            {
                label: 'Menor o igual que',
                value: FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
            },
            { label: 'Mayor que', value: FilterMatchMode.GREATER_THAN },
            {
                label: 'Mayor o igual que',
                value: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
            },
        ];
        this.loading = true;
    }

    loadUsuarios(event: any) {
        this.rows = event.rows;
        this.sortField = event.sortField;

        if (this.sortField == undefined) {
            this.sortField = 'name';
        }

        if (event.sortOrder == 1) {
            this.sortOrder = 'ASC';
        } else {
            this.sortOrder = 'DESC';
        }

        this.currentPage = event.first / event.rows;

        this._filterPage = this.util.NestJsonFilter(event.filters);

        this.loading = true;

        this.getPage(
            this.currentPage,
            this.rows,
            this.sortField,
            this.sortOrder,
            this._filterPage
        );
    }

    getPage(
        page?: number,
        rows?: number,
        sortField?: string,
        sortOrder?: string,
        filter?: any
    ) {
        this.usuarioService
            .getPaginator(page, rows, sortField, sortOrder, filter)
            .subscribe((res) => {
                this.usuarios = res.content;
                this.totalRecords = res.totalElements;
                this.loading = false;
            });
    }
    new() {
        this.ref = this.dialogService.open(UsuarioFormComponent, {
            header: 'Nuevo Usuario',
            width: '60%',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }

    edit(User: User) {
        this.usuarioService.findById(User.idUser).subscribe((data) => {
            console.log(data);
            this.ref = this.dialogService.open(UsuarioFormComponent, {
                header: 'Editar Usuario',
                width: '60%',
                contentStyle: { overflow: 'auto' },
                baseZIndex: 10000,
                maximizable: true,
                data: data,
            });
        });
    }

    delete(usuario: User) {
        this.deleteUserDialog = true;
        this.usuario = { ...usuario };
    }

    confirmDelete() {
        this.deleteUserDialog = false;
        this.usuarioService.delete(this.usuario.idUser).subscribe((resp) => {
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Registro eliminado con éxito',
                life: 3000,
            });
            this.usuario = new User();
            this.getPage(
                this.currentPage,
                this.rows,
                this.sortField,
                this.sortOrder,
                this._filterPage
            );
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    cambiarEstado(event: Event, usuario: User) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `¿Está seguro que desea cambiar el estado del usuario: ${usuario.name}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            acceptLabel: 'SI',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                let data = {
                    "idUser": usuario.idUser,
                    "enabled": !usuario.enabled
                  }
                  this.usuarioService
                    .cambiarEstado(data)
                    .subscribe((resp) => {
                      this.usuarioService.setUserChange(resp);
                      this.usuarioService.setMessageChange({
                        key: 'tc',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Datos guardados correctmanete',
                        life: 3000,
                    });
                    });
            },
            reject: () => {

            },
        });
    }

    importarUsuarios(){
        this.ref = this.dialogService.open(UsuarioImportarComponent, {
            header: 'Importar Usuarios',
            width: '500px',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: true,
        });
    }
}
