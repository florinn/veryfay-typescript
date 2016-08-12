namespace VeryfayIntern {

    export class AuthorizationEngine {
        private _activityRegistry: ActivityRegistry = new ActivityRegistry();

        register(activity: Activity<any>, ...moreActivities: Activity<any>[]) {
            let ps = new PermissionSet(this);
            this._activityRegistry.add(activity, ps);
            for (let a of moreActivities)
                this._activityRegistry.add(a, ps);
            return ps;
        }

        get(activity: Activity<any>) {
            return new ActivityAuthorization(activity, this._activityRegistry);
        }
    }

}