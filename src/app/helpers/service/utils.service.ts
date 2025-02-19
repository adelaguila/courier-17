import { Injectable } from "@angular/core";
import { FilterModel } from "src/app/shared/clases/filter-model";

@Injectable({
    providedIn: "root",
})
export class UtilsService {
    constructor() {}

    serialize(obj: any) {
        var p = [];
        for (var key in obj) {
            if (encodeURIComponent(obj[key]) == "null") {
            } else {
                p.push(key + "=" + encodeURIComponent(obj[key]));
            }
        }
        return p.join("&");
    }

    MaterialJsonFilter(
        filter: FilterModel,
        value: any,
        field: string,
        matchMode: string
    ) {
        if (value.length == 0) value = null;

        if (value) {
            // filter.logic = 'and';
            let flagExiste: Boolean = false;

            for (let index = 0; index < filter.filters.length; index++) {
                const element = filter.filters[index];
                if (element.field == field) {
                    filter.filters[index].field = field;
                    filter.filters[index].matchMode = matchMode;
                    filter.filters[index].value = value;
                    flagExiste = true;
                }
            }

            if (!flagExiste)
                filter.filters.push({
                    field: field,
                    matchMode: matchMode,
                    value: value,
                });
        } else {
            for (let index = 0; index < filter.filters.length; index++) {
                const element = filter.filters[index];
                if (element.field == field) {
                    filter.filters.splice(index, 1);
                }
            }
        }

        return filter.filters;
    }

    NestJsonFilter(filters: any) {
        let arrayFiltro: FilterModel = new FilterModel();
        for (let [field, filter] of Object.entries(filters)) {
            let filtros = Object.values(filter);

            if (filtros[0] != null) {
                let match = this.changeOperador(filtros[1]);
                if(match == "=" && filtros[0] == ""){

                }else{
                    arrayFiltro.filters.push({
                        field: field,
                        matchMode: match,
                        value: filtros[0],
                    });
                }
            }
        }

        return arrayFiltro.filters;
    }

    changeOperador(operador: string) {
        let oper = "";
        switch (operador) {
            case "startsWith":
                oper = "STARTSWITH";
                break;
            case "contains":
                oper = "LIKE";
                break;
            case "notContains":
                oper = "NOTLIKE";
                break;
            case "endsWith":
                oper = "ENDSWITH";
                break;
            case "equals":
                oper = "=";
                break;
            case "notEquals":
                oper = "!=";
                break;
            case "in":
                oper = "$in";
                break;
            case "between":
                oper = "$btw";
                break;
            case "lt":
                oper = "<";
                break;
            case "lte":
                oper = "<=";
                break;
            case "gt":
                oper = ">";
                break;
            case "gte":
                oper = ">=";
                break;
            case "is":
                oper = "$is";
                break;
            case "isNot":
                oper = "$not:$is";
                break;
            case "before":
                oper = "";
                break;
            case "after":
                oper = "";
                break;
            case "dateIs":
                oper = "";
                break;
            case "dateIsNot":
                oper = "";
                break;
            case "dateBefore":
                oper = "";
                break;
            case "dateAfter":
                oper = "";
                break;
            default:
                oper = "";
        }

        return oper;
    }
}
