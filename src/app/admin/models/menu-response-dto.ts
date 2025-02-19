import { Role } from "./role";
import { SubMenuResponseDTO } from "./submenu-response-dto";

export class MenuResponseDTO{
    icon: string;
    label: string;
    roles: Role[];
    items: SubMenuResponseDTO[];
}
