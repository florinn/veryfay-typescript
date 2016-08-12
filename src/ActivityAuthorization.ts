namespace VeryfayIntern {

    export class ActivityAuthorization {
        private _activityTargetType: string;

        constructor(public activity: Activity<any>, public activityRegistry: ActivityRegistry) {
            let activityType = Common.Utils.typeName(activity);
            this._activityTargetType = `${activityType}<${activity.targetType}>`;
        }

        isAllowing<TPrincipal, TExtraInfo>(principal: TPrincipal, extraInfo?: TExtraInfo): IsAllowingResult {
            return this.authorize(principal, extraInfo);
        }

        verify<TPrincipal, TExtraInfo>(principal: TPrincipal, extraInfo?: TExtraInfo): string {
            let result = this.authorize(principal, extraInfo);

            if (result.isSuccess)
                return result.details;
            else
                throw new Error.AuthorizationException(result.details);
        }

        private authorize<TPrincipal, TExtraInfo>(principal: TPrincipal, extraInfo?: TExtraInfo): IsAllowingResult {
            let activityPermissions: PermissionSet[] = [];

            try {
                activityPermissions = this.activityRegistry.get(this.activity);
            } catch (e) {
                return new IsAllowingResult(false, `authorization failed for ${this._activityTargetType}\n ${e.message}`);
            }

            let details: string;
            try {
                details = PermissionVerifier.verify(activityPermissions, principal, extraInfo);
            } catch (e) {
                return new IsAllowingResult(false, `authorization failed for ${this._activityTargetType}\n ${e.message}`);
            }

            return new IsAllowingResult(true, `authorization succeeded for ${this._activityTargetType}\n ${details}`);
        }
    }

    export class IsAllowingResult {
        constructor(public isAllowing: boolean, private _details: string) { }

        get isFailure() { return !this.isAllowing; }
        get isSuccess() { return this.isAllowing; }
        get details() { return this._details; }
    }
}