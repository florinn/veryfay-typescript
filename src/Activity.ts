/// <reference path='_all.ts' />

namespace VeryfayIntern {

    export abstract class Activity<TTarget> {
        constructor(private _target: Common.Ctor<TTarget>) {
        }
        get target(): Common.Ctor<TTarget> {
            return this._target;
        }
        get targetType(): string {
            let type = Common.Utils.functionName(this.target);
            return type;
        }
    }
    export abstract class Container<TTarget> {
        abstract activities(): Activity<TTarget>[];
    }

    export class Create<TTarget> extends Activity<TTarget> {
        constructor(target: Common.Ctor<TTarget>) {
            super(target);
        }
    }
    export class Read<TTarget> extends Activity<TTarget> {
        constructor(target: Common.Ctor<TTarget>) {
            super(target);
        }
    }
    export class Update<TTarget> extends Activity<TTarget> {
        constructor(target: Common.Ctor<TTarget>) {
            super(target);
        }
    }
    export class Patch<TTarget> extends Activity<TTarget> {
        constructor(target: Common.Ctor<TTarget>) {
            super(target);
        }
    }
    export class Delete<TTarget> extends Activity<TTarget> {
        constructor(target: Common.Ctor<TTarget>) {
            super(target);
        }
    }

    export class CRUD<TTarget> extends Activity<TTarget> implements Container<TTarget> {
        private _activities: Activity<TTarget>[];
        constructor(target: Common.Ctor<TTarget>) {
            super(target);
            this._activities = [
                new Create<TTarget>(this.target),
                new Read<TTarget>(this.target),
                new Update<TTarget>(this.target),
                new Delete<TTarget>(this.target)];
        }
        activities() { return this._activities; }
    }
    Common.Utils.applyMixins(CRUD, [Container]);

    export class CRUDP<TTarget> extends Activity<TTarget> implements Container<TTarget> {
        private _activities: Activity<TTarget>[];
        constructor(target: Common.Ctor<TTarget>) {
            super(target);
            this._activities = [
                new CRUD<TTarget>(this.target),
                new Patch<TTarget>(this.target)];
        }
        activities() { return this._activities; }
    }
    Common.Utils.applyMixins(CRUDP, [Container]);
}