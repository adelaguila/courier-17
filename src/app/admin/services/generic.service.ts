import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GenericService<T> {
    constructor(
        protected http: HttpClient,
        @Inject('url') protected url: string
    ) {}

    getPaginator(
        page?: number,
        rows?: number,
        sortfield?: string,
        sortorder?: string,
        filtros?: any
    ): Observable<any> {
        let obj = {
            pageNumber: page,
            rowsPerPage: rows,
            sorts: [{ field: sortfield, sort: sortorder }],
            filters: filtros,
        };

        return this.http.post(`${this.url}/paginate`, obj);
    }

    findAll() {
        return this.http.get<T[]>(this.url);
    }

    findById(id: string | number) {
        return this.http.get<T>(`${this.url}/${id}`);
    }

    save(t: T) {
        return this.http.post(this.url, t);
    }

    update(id: string | number, t: T) {
        return this.http.put(`${this.url}/${id}`, t);
    }

    delete(id: string | number) {
        return this.http.delete(`${this.url}/${id}`);
    }
}
