import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PrimengModule } from '../../../../primeng/primeng.module';
import { UserService } from 'src/app/admin/services/user.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-usuario-importar',
  standalone: true,
  imports: [PrimengModule],
  providers: [MessageService],
  templateUrl: './usuario-importar.component.html',
  styleUrl: './usuario-importar.component.scss'
})
export class UsuarioImportarComponent {

    selectedFiles: FileList;
  filename: string;
  isLoadingResults = false;
  isRateLimitReached = false;

  constructor(
    private userService: UserService,
    public ref: DynamicDialogRef,
  ) {}


  selectFile(e: any) {
    this.selectedFiles = e.target.files;
    this.filename = e.target.files[0]?.name;

    console.log(e);
  }
  upload(){
    if(this.selectedFiles.item(0) != null){
      this.isLoadingResults = true;
      this.userService.importarUsersFromExcel(this.selectedFiles.item(0)).subscribe(data => {

        if(data == 1){
          this.isLoadingResults = false;
          this.isRateLimitReached = false;

          this.userService.setUserChange(data);
          this.userService.setMessageChange({
            key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Usuarios cargados correctamente',
                    life: 3000,
          });

          this.ref.close();

        }else{
          this.userService.setMessageChange({
                key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'Error al cargar los datos',
                life: 3000,
            });

        }

      });
    }
  }
}
