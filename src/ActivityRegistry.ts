namespace VeryfayIntern {

    export class ActivityRegistry {
        private _registeredPermissions: { [type: string]: PermissionSet[] } = {};

        add<TTarget>(activity: Activity<TTarget>, ps: PermissionSet) {

            if (activity instanceof Container)
                for (let a of (<any>activity).activities())
                    this.add(a, ps);
            else
                this.addActivityPermissions(activity, ps);
        }

        private addActivityPermissions<TTarget>(activity: Activity<TTarget>, ps: PermissionSet) {

            let activityPermissionList: PermissionSet[] = [];
            let key = activity.targetType;
            if (key in this._registeredPermissions)
                activityPermissionList = this._registeredPermissions[key];
            this._registeredPermissions[key] = activityPermissionList.concat(ps);
        }

        get<TTarget>(activity: Activity<TTarget>) {

            let permissionSets: PermissionSet[] = this._registeredPermissions[activity.targetType];
            if (permissionSets)
                return permissionSets;
            else {
                let msg = `no registered activity of type ${activity.targetType}`;
            }
        }
    }
}