namespace VeryfayIntern {

    export abstract class RoleSet<TPrincipal, TExtraInfo> {

        abstract roles(): Role<TPrincipal, TExtraInfo>[];

        abstract principalType(): string;
        abstract extraInfoType(): string;

        check(principal: TPrincipal, extraInfo?: TExtraInfo): boolean {
            let result = true;
            let visitor = (role: Role<TPrincipal, TExtraInfo>) => {
                if (result && !role.contains(principal, extraInfo))
                    result = false;
            };
            this.traverse(this.roles(), visitor);
            return result;
        }

        getMsg(principal: TPrincipal, extraInfo?: TExtraInfo) {
            let msg = "";
            let breakIt = false;
            let visitor = (role: Role<TPrincipal, TExtraInfo>) => {
                if (!breakIt) {
                    let roleType = Common.Utils.typeName(role);
                    let principalType = Common.Utils.typeName(principal);
                    let extraInfoType = Common.Utils.typeName(extraInfo);
                    if (role.contains(principal, extraInfo)) {
                        msg += `${roleType} contains ${principalType} and ${extraInfoType} AND\n`;
                    } else {
                        msg += `${roleType} DOES NOT contain ${principalType} and ${extraInfoType}\n`;
                        breakIt = true;
                    }
                }
            };
            this.traverse(this.roles(), visitor);
            return msg;
        }

        private traverse(roles: Role<TPrincipal, TExtraInfo>[], visitor: (role: Role<TPrincipal, TExtraInfo>) => void) {
            for (let role of roles)
                visitor(role);
        }
    }

    export class AllowRoleSet<TPrincipal, TExtraInfo> extends RoleSet<TPrincipal, TExtraInfo> {

        constructor(private _roles: Role<TPrincipal, TExtraInfo>[], private _principalType: string, private _extraInfoType: string) {
            super();
        }

        roles() { return this._roles; }

        principalType() { return this._principalType; }
        extraInfoType() { return this._extraInfoType; }
    }

    export class DenyRoleSet<TPrincipal, TExtraInfo> extends RoleSet<TPrincipal, TExtraInfo> {

        constructor(private _roles: Role<TPrincipal, TExtraInfo>[], private _principalType: string, private _extraInfoType: string) {
            super();
        }

        roles() { return this._roles; }

        principalType() { return this._principalType; }
        extraInfoType() { return this._extraInfoType; }
    }
}