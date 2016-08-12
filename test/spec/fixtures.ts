/// <reference path='../setup.ts' />

namespace VeryfayTests {

    export class SomeActivity<TTarget> extends veryfay.Activity<TTarget> {
        constructor(target: Veryfay.Ctor<TTarget>) {
            super(target);
        }
    }

    export class SomeContainerActivity<TTarget> extends veryfay.Activity<TTarget> implements Veryfay.Container<TTarget> {
        private _activities: Veryfay.Activity<TTarget>[];
        constructor(target: Veryfay.Ctor<TTarget>) {
            super(target);
            this._activities = [
                new veryfay.Create<TTarget>(this.target),
                new veryfay.Read<TTarget>(this.target),
                new veryfay.Update<TTarget>(this.target),
                new veryfay.Delete<TTarget>(this.target)];
        }
        activities() { return this._activities; }
    }
    veryfay.Utils.applyMixins(SomeContainerActivity, [veryfay.Container]);

    export class SomeClass { }
    export class SomeOtherClass { }
    export class OtherSomeOtherClass { }

    export class PrincipalClass {
        constructor(private _username: string) { }

        public get username() { return this._username; }
    }

    export class OtherPrincipalClass {
        constructor(private _username: string) { }

        public get username() { return this._username; }
    }

    export class Admin extends veryfay.Role<PrincipalClass, number> {
        private static _instance = new Admin(new PrincipalClass("admin"), 0);
        static get instance() { return Admin._instance; }

        constructor(private _principal: PrincipalClass, private _extraInfo: number) {
            super();
            if (Admin._instance)
                throw new Error("instantiation failed: use .instance instead of new");
            Admin._instance = this;
        }

        principal() { return this._principal; }
        extraInfo() { return this._extraInfo; }
        contains(principal: PrincipalClass, extraInfo?: number): boolean {
            return principal.username === this._principal.username;
        }
    }

    export class Supervisor extends veryfay.Role<PrincipalClass, string> {
        private static _instance = new Supervisor(new PrincipalClass("supervisor"), "");
        static get instance() { return Supervisor._instance; }

        constructor(private _principal: PrincipalClass, private _extraInfo: string) {
            super();
            if (Supervisor._instance)
                throw new Error("instantiation failed: use .instance instead of new");
            Supervisor._instance = this;
        }

        principal() { return this._principal; }
        extraInfo() { return this._extraInfo; }
        contains(principal: PrincipalClass, extraInfo?: string): boolean {
            return principal.username === this._principal.username ||
                principal.username === "supervisor-commiter";
        }
    }

    export class Commiter extends veryfay.Role<PrincipalClass, string> {
        private static _instance = new Commiter(new PrincipalClass("commiter"), "");
        static get instance() { return Commiter._instance; }

        constructor(private _principal: PrincipalClass, private _extraInfo: string) {
            super();
            if (Commiter._instance)
                throw new Error("instantiation failed: use .instance instead of new");
            Commiter._instance = this;
        }

        principal() { return this._principal; }
        extraInfo() { return this._extraInfo; }
        contains(principal: PrincipalClass, extraInfo?: string): boolean {
            return principal.username === this._principal.username ||
                principal.username === "supervisor-commiter";
        }
    }

    export class Contributor extends veryfay.Role<OtherPrincipalClass, number> {
        private static _instance = new Contributor(new OtherPrincipalClass("contributor"), 0);
        static get instance() { return Contributor._instance; }

        constructor(private _principal: OtherPrincipalClass, private _extraInfo: number) {
            super();
            if (Contributor._instance)
                throw new Error("instantiation failed: use .instance instead of new");
            Contributor._instance = this;
        }

        principal() { return this._principal; }
        extraInfo() { return this._extraInfo; }
        contains(principal: OtherPrincipalClass, extraInfo?: number): boolean {
            return principal.username === this._principal.username ||
                principal.username === "contributor-reader";
        }
    }

    export class Reviewer extends veryfay.Role<PrincipalClass, number> {
        private static _instance = new Reviewer(new PrincipalClass("reviewer"), 0);
        static get instance() { return Reviewer._instance; }

        constructor(private _principal: PrincipalClass, private _extraInfo: number) {
            super();
            if (Reviewer._instance)
                throw new Error("instantiation failed: use .instance instead of new");
            Reviewer._instance = this;
        }

        principal() { return this._principal; }
        extraInfo() { return this._extraInfo; }
        contains(principal: PrincipalClass, extraInfo?: number): boolean {
            return principal.username === "contributor" ||
                principal.username === "commiter";
        }
    }

    export class Reader extends veryfay.Role<OtherPrincipalClass, [number, string]> {
        private static _instance = new Reader(new OtherPrincipalClass("reader"), [1234, ""]);
        static get instance() { return Reader._instance; }

        constructor(private _principal: OtherPrincipalClass, private _extraInfo: [number, string]) {
            super();
            if (Reader._instance)
                throw new Error("instantiation failed: use .instance instead of new");
            Reader._instance = this;
        }

        principal() { return this._principal; }
        extraInfo() { return this._extraInfo; }
        contains(principal: OtherPrincipalClass, extraInfo?: [number, string]): boolean {
            return principal.username === this._principal.username &&
                extraInfo && extraInfo[0] === this._extraInfo[0];
        }
    }

}