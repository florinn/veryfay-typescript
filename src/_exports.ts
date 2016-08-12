/// <reference path='_all.ts' />

interface IVeryfay {
    Utils: typeof VeryfayIntern.Common.Utils;
    AuthorizationEngine: typeof VeryfayIntern.AuthorizationEngine;
    Role: typeof VeryfayIntern.Role;
    Activity: typeof VeryfayIntern.Activity;
    Container: typeof VeryfayIntern.Container;
    Create: typeof VeryfayIntern.Create;
    Read: typeof VeryfayIntern.Read;
    Update: typeof VeryfayIntern.Update;
    Patch: typeof VeryfayIntern.Patch;
    Delete: typeof VeryfayIntern.Delete;
    CRUD: typeof VeryfayIntern.CRUD;
    CRUDP: typeof VeryfayIntern.CRUDP;
    Nothing: typeof VeryfayIntern.Nothing;
    AuthorizationException: typeof VeryfayIntern.Error.AuthorizationException;
}

module Veryfay {
    export import Ctor = VeryfayIntern.Common.Ctor;
    export import Utils = VeryfayIntern.Common.Utils;
    export import AuthorizationEngine = VeryfayIntern.AuthorizationEngine;
    export import Role = VeryfayIntern.Role;
    export import Activity = VeryfayIntern.Activity;
    export import Container = VeryfayIntern.Container;
    export import Create = VeryfayIntern.Create;
    export import Read = VeryfayIntern.Read;
    export import Update = VeryfayIntern.Update;
    export import Patch = VeryfayIntern.Patch;
    export import Delete = VeryfayIntern.Delete;
    export import CRUD = VeryfayIntern.CRUD;
    export import CRUDP = VeryfayIntern.CRUDP;
    export import Nothing = VeryfayIntern.Nothing;
    export import AuthorizationException = VeryfayIntern.Error.AuthorizationException;
}

declare let veryfay: IVeryfay;
veryfay = Veryfay;
