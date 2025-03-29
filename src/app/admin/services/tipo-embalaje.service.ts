import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TipoEmbalaje } from '../models/tipo-embalaje';

@Injectable({
    providedIn: 'root',
})
export class TipoEmbalajeService extends GenericService<TipoEmbalaje> {
    private tipoEmbalajeChange: Subject<TipoEmbalaje[]> = new Subject<
        TipoEmbalaje[]
    >();
    private messageChange: Subject<any> = new Subject<any>();

    constructor(protected override http: HttpClient) {
        super(http, `${environment.HOST}/tipos-embalajes`);
    }

    getTipoEmbalajeChange() {
        return this.tipoEmbalajeChange.asObservable();
    }

    setTipoEmbalajeChange(data: any) {
        this.tipoEmbalajeChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }

    setMessageChange(data: any) {
        this.messageChange.next(data);
    }
}
