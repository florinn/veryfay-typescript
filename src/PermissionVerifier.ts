/// <reference path='_all.ts' />

namespace VeryfayIntern {

    export class PermissionVerifier {

        static verify<TPrincipal, TExtraInfo>(
            activityPermissions: PermissionSet[], principal: TPrincipal, extraInfo?: TExtraInfo): string {
            let resMsg = "";
            let activityPermissionsCuratedRoleSets: PermissionSet[] =
                PermissionVerifier.curateRoleSets(activityPermissions, principal, extraInfo);

            for (let ap of activityPermissionsCuratedRoleSets) {
                let denyRoleSets = ap.roleSets.filter(roleSet => {
                    if (roleSet instanceof DenyRoleSet)
                        return true;
                    return false;
                });

                for (let denyRoleSet of denyRoleSets) {
                    let msg = denyRoleSet.getMsg(principal, extraInfo);

                    if (denyRoleSet.check(principal, extraInfo)) {
                        resMsg += `### DENY SET => TRUE: ${msg}\n`;
                        throw new Error.AuthorizationException(resMsg);
                    } else
                        resMsg += `--- DENY SET => FALSE: ${msg}\n`;
                }
            }

            for (let ap of activityPermissionsCuratedRoleSets) {
                let allowRoleSets = ap.roleSets.filter(roleSet => {
                    if (roleSet instanceof AllowRoleSet)
                        return true;
                    return false;
                });

                for (let allowRoleSet of allowRoleSets) {
                    let msg = allowRoleSet.getMsg(principal, extraInfo);

                    if (allowRoleSet.check(principal, extraInfo)) {
                        resMsg += `### ALLOW SET => TRUE: ${msg}\n`;
                        return resMsg;
                    } else
                        resMsg += `--- ALLOW SET => FALSE: ${msg}\n`;
                }
            }

            throw new Error.AuthorizationException(resMsg || "NO MATCHING ROLE SET FOUND");
        }

        private static curateRoleSets<TPrincipal, TExtraInfo>(
            activityPermissions: PermissionSet[], principal: TPrincipal, extraInfo: TExtraInfo): PermissionSet[] {
            let result: PermissionSet[] = [];
            if (activityPermissions)
                for (let ap of activityPermissions) {
                    let roleSets = ap.roleSets.filter(roleSet => {
                        if (roleSet.principalType() === Common.Utils.typeName(principal) &&
                            (!extraInfo ||
                                roleSet.extraInfoType() === Common.Utils.typeName(extraInfo)))
                            return true;
                        return false;
                    });
                    let newAp = new PermissionSet(ap.and);
                    newAp.roleSets = roleSets;
                    result.push(newAp);
                }
            return result;
        }

    }

}