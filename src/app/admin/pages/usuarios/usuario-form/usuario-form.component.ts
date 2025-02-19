import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/primeng/primeng.module';

import { UserService } from 'src/app/admin/services/user.service';
import { User } from 'src/app/admin/models/user';
import { RoleService } from 'src/app/admin/services/role.service';
import { Role } from 'src/app/admin/models/role';
import { map } from 'rxjs';

@Component({
    selector: 'app-Usuario-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './usuario-form.component.html',
    styleUrl: './usuario-form.component.scss',
})
export class UsuarioFormComponent implements OnInit {
    usuario: User;
    form: FormGroup;
    title: string = '';
    idEdit!: boolean;
    submitted = false;
    roles: Role[];
    rolesAdd: Role[] = [];
    rolesSeleccionados: any[] = [];
    readOnlyID: boolean = false;
    isEdit: boolean = false;

    constructor(
        private usuarioService: UserService,
        private roleService: RoleService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        if (this.config.data) {
            this.title = 'EDITAR USUARIO';
            this.usuario = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;
        } else {
            this.title = 'NUEVO USUARIO';
            this.usuario = new User();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.roleService
            .findAll()
            .pipe(
                map((result) => {
                    result.map((role) => {
                        if (this.isEdit) {
                            let existe = this.usuario.roles.filter(
                                (element) => element.idRole == role.idRole
                            );
                            if (existe.length > 0) {
                                role.checked = true;
                                this.rolesSeleccionados.push(role.idRole);
                                this.rolesAdd.push(role);
                            }
                        }
                        return role;
                    });

                    return result;
                })
            )
            .subscribe((data) => {
                this.roles = data;
            });

        this.form = new FormGroup({
            username: new FormControl(this.usuario?.username, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(150),
                Validators.email
            ]),
            name: new FormControl(this.usuario?.name, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(150),
            ]),
            telefono: new FormControl(this.usuario?.telefono),
            password: new FormControl(this.usuario?.password, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(150),
            ]),
        });

        // setTimeout(() => {
        //     const tipoUsuarioValue = this.form.controls['tipoUsuario'].value;
        //     this.form.controls['tipoUsuario'].setValue('');
        //     this.form.controls['tipoUsuario'].setValue(tipoUsuarioValue);
        // });
        // console.log(this.usuario);
    }
    get f() {
        return this.form.controls;
    }
    seleccion(seleccion: any) {
        console.log(seleccion);
        console.log(this.rolesSeleccionados);
        // const value = +seleccion.source.value;
        // if(seleccion.checked) {
        //   this.rolesSeleccionados.push(value);
        // }else{
        //   let indice = this.rolesSeleccionados.indexOf(value); // obtenemos el indice
        //   this.rolesSeleccionados.splice(indice, 1); // 1 es la cantidad de elemento a eliminar
        // }
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

        const values = this.form.value;
        const recordId = this.usuario.idUser;

        if (this.isEdit) {
            this.usuario.name = values.name;
            this.usuario.username = values.username;
            this.usuario.telefono = values.telefono;
            this.usuario.roles = this.rolesAdd;

            this.usuarioService.update(recordId, this.usuario).subscribe((data) => {
                this.usuarioService.setUserChange(data);
                this.usuarioService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.usuario = { ...this.form.value };
            this.usuario.roles = this.rolesAdd;
            this.usuarioService.save(this.usuario).subscribe((data) => {
                this.usuarioService.setUserChange(data);
                this.usuarioService.setMessageChange({
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
}
