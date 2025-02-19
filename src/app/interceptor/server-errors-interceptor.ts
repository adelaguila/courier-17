import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
} from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { tap, retry, catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ServerErrorsInterceptor implements HttpInterceptor {
    constructor(
        private messageService: MessageService,
        private router: Router
    ) {}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next
            .handle(request)
            .pipe(retry(environment.REINTENTS))
            .pipe(
                tap((event) => {
                    if (event instanceof HttpResponse) {
                        if (
                            event.body &&
                            event.body.error === true &&
                            event.body.errorMessage
                        ) {
                            throw new Error(event.body.errorMessage);
                        }
                        /*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });
                    }*/
                    }
                })
            )
            .pipe(
                catchError((err) => {
                    if (err.status === 400) {
                        //console.log(err);
                        this.messageService.add({
                            key: "notificacion",
                            severity: "error",
                            summary: "ERROR 400",
                            detail: err.message,
                            life: 5000,
                        });
                    } else if (err.status === 404) {
                        this.messageService.add({
                            key: "notificacion",
                            severity: "error",
                            summary: "ERROR 404",
                            detail: 'No existe el recurso',
                            life: 5000,
                        });
                    } else if (err.status === 403 || err.status === 401) {
                        // console.log(err);
                        this.messageService.add({
                            key: "notificacion",
                            severity: "error",
                            summary: "ERROR 403",
                            detail: err.error.message,
                            life: 5000,
                        });
                        //sessionStorage.clear();
                        //this.router.navigate(['/login']);
                    } else if (err.status === 500) {
                        this.messageService.add({
                            key: "notificacion",
                            severity: "error",
                            summary: "ERROR 500",
                            detail: err.error.message,
                            life: 5000,
                        });
                    } else {
                        this.messageService.add({
                            key: "notificacion",
                            severity: "error",
                            summary: "ERROR",
                            detail: err.error.message,
                            life: 5000,
                        });
                    }
                    return EMPTY;
                })
            );
    }
}
