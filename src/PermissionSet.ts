/// <reference path='_all.ts' />

namespace VeryfayIntern {

    export class PermissionSet {
        roleSets: RoleSet<any, any>[] = [];
        get and(): AuthorizationEngine { return this._ae; } 

        constructor(private _ae: AuthorizationEngine) { }

        allow<TPrincipal, TExtraInfo>(role: Role<TPrincipal, TExtraInfo>, ...moreRoles: Role<TPrincipal, TExtraInfo>[]) {
            let roles = [role].concat(moreRoles);
            let principalType = Common.Utils.typeName(role.principal());
            let extraInfoType = Common.Utils.typeName(role.extraInfo());
            this.roleSets.push(new AllowRoleSet<TPrincipal, TExtraInfo>(roles, principalType, extraInfoType));
            return this;
        }

        deny<TPrincipal, TExtraInfo>(role: Role<TPrincipal, TExtraInfo>, ...moreRoles: Role<TPrincipal, TExtraInfo>[]) {
            let roles = [role].concat(moreRoles);
            let principalType = Common.Utils.typeName(role.principal());
            let extraInfoType = Common.Utils.typeName(role.extraInfo());
            this.roleSets.push(new DenyRoleSet<TPrincipal, TExtraInfo>(roles, principalType, extraInfoType));
            return this;
        }
    }

}