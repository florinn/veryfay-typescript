Veryfay (TypeScript) [![build badge](https://travis-ci.org/florinn/veryfay-typescript.svg?branch=master)](https://travis-ci.org/florinn/veryfay-typescript)
===================

**Veryfay (TypeScript)** is a library for doing activity based authorization in TypeScript. It is a port to TypeScript of the [**Veryfay**](https://github.com/florinn/veryfay-scala) library in Scala.

It deals with three things: 
- defining activities and roles
- who is allowed (or denied) to perform activities 
- checking that activities can be performed for certain input data

----------


Overview
-------------
When it comes to building a security system, probably the favoured approach is the so called **role based security (RBA)**. 
The idea is fairly simple, users are assigned roles and in turn the roles have associated permissions (or activities).

While it appears like a good idea at first and it certainly works well if the number of roles is limited to just a few, it may get quickly very complicated when the number of roles increases.   
An apparent drawback is that it becomes difficult to determine all the roles allowed (or denied) for a certain activity.

The alternative is called **activity based authorization (ABA)** and it is the role based security turned on its head, if you will.
It solves the aforementioned drawback by making activity the central concept of the security mechanism.

###### Terminology

- *activity*: aka *permission*, it is the combination btw action (e.g *Read*) and an optional target (e.g. *SomeClass*)
- *role*: a logical grouping of principal types, defined either statically or dynamically
- *principal*: an entity that can be identified and verified

Define authorization rules|
---|
>**RBA**  
`role > activities`

>**ABA**   
`activity > roles`

RBA works by associating activities to each role while ABA associates roles to each activity.

Verify authorization rules|
---|
>**RBA**  
`input principal > roles > activities` & `input activity`

>**ABA**   
*a.* `input activity > roles > principals` & `input principal`   
*b.* `input activity > roles` & `input principal > roles`

When checking for authorization, RBA starts from the specified principal, determines associated roles and intersects their activity sets with the input activity.

ABA mirrors that process, it starts from the specified activity, determines associated roles and intersects their principal sets with the input principal (*case a* shown above).   
*Case b* shows the more practical approach, it starts from the specified activity and determines its associated roles then determines the roles associated to the input principal and intersects the two sets of roles.


Features
-------------
* Define multiple authorization engines in the same application
* Define activities with or without a target class
* Specify allow or deny sets
* Associate roles to multiple activities through hierarchical activity containers
* Check authorization either by returning boolean or exception throwing


Installing
-------------

```
npm veryfay 
```

The distribution directory should contain:

* *Compiled JavaScript:* `veryfay.js` and its minified version `veryfay-min.js`
* *TypeScript definitions:* `veryfay.d.ts` and `veryfay.node.d.ts`

###### TypeScript 1.6 and later

```typescript
import * as Veryfay from "veryfay";
```

###### TypeScript pre 1.6

```typescript
/// <reference path="./node_modules/veryfay/veryfay.d.ts" />

veryfay = require("veryfay");
```


Usage
-------------

### Define authorization rules

This part consists of a few straightforward preparatory operations that culminate with the creation of an "authorization engine" to be used later to perform authorization verification.

##### Define any custom activities

An activity takes a class type parameter describing the target for the activity, which may be any class defined in your application.

For activities with no target, you should specify **Nothing** as the type argument of the activity.

There are a few predefined activities: 
- *Create*
- *Read*
- *Update*
- *Patch*
- *Delete*

You may define your own activities by inheriting from `Activity<TTarget>`:

```typescript
class SomeActivity<TTarget> extends Veryfay.Activity<TTarget> {
    constructor(target: Veryfay.Ctor<TTarget>) {
            super(target);
    }
}
```

##### Define any container activities

Container activities help with associating multiple actions to the same role(s).  
Instead of repeating the same activities over and over again, a container activity may be defined holding a list of activities (including container activities).

There a couple predefined container activities:
- *CRUD* containing activities: *Create*, *Read*, *Update*, *Delete*
- *CRUDP* containing activities: *CRUD*, *Patch*

Define your own container activities like so:

```typescript
export class SomeContainerActivity<TTarget> 
    extends Veryfay.Activity<TTarget> 
    implements Veryfay.Container<TTarget> {
        private _activities: Veryfay.Activity<TTarget>[];
        constructor(target: Veryfay.Ctor<TTarget>) {
            super(target);
            this._activities = [
                new Veryfay.SomeActivity<TTarget>(this.target),
                new Veryfay.SomeOtherActivity<TTarget>(this.target)];
        }
        activities() { return this._activities; }
}
Veryfay.Utils.applyMixins(SomeContainerActivity, [Veryfay.Container]);
```

>**Note:** Container activities are used only for defining authorization rules, they are not used when verifying authorization rules

##### Define roles

You may define a role by inheriting from `Role<TPrincipal, TExtraInfo>`, where
- *TPrincipal* is the type of the principal class passed into the role definition 
- *TExtraInfo* is the type of any extra info that may get passed into the role definition

In `contains` you can place any logic to determine if the input data belongs to that role.

```typescript
class SomeRole extends Veryfay.Role<SomePrincipalClass, SomeClass> {
    private static _instance = new SomeRole(new SomePrincipalClass(), new SomeClass());
    static get instance() { return SomeRole._instance; }

    constructor(private _principal: SomePrincipalClass, private _extraInfo: SomeClass) {
        super();
        if (SomeRole._instance)
            throw new Error("instantiation failed: use .instance instead of new");
        SomeRole._instance = this;
    }

    principal() { return this._principal; }
    extraInfo() { return this._extraInfo; }
    contains(principal: SomePrincipalClass, extraInfo?: SomeClass): boolean {
        // Some logic to determine if input belongs to the role
    }
}
```

##### Configure authorization rules 

You may use `register`, `allow`, `deny` and `and` to associate any allow and deny roles with one or more activities in the context of an authorization engine:

```typescript
let ae: Veryfay.AuthorizationEngine = new Veryfay.AuthorizationEngine()
    .register(new Veryfay.CRUDP(Veryfay.Nothing))
        .allow(Admin.instance).deny(Supervisor.instance, Commiter.instance).deny(Contributor.instance).and
    .register(new Veryfay.CRUDP(SomeOtherClass))
        .allow(Admin.instance).allow(Supervisor.instance).allow(Reader.instance).allow(Contributor.instance).and
    .register(new Veryfay.Create(Veryfay.Nothing))
        .allow(Commiter.instance).deny(Contributor.instance).and
    .register(new Veryfay.Read(Veryfay.Nothing))
        .allow(Commiter.instance).deny(Contributor.instance).allow(Reviewer.instance).and
    .register(new Veryfay.Read(SomeClass))
        .allow(Supervisor.instance, Commiter.instance).and
    .register(new Veryfay.Read(SomeClass), new Veryfay.Read(SomeOtherClass))
        .allow(Supervisor.instance).allow(Contributor.instance).deny(Reader.instance).and
    .register(new Veryfay.Read(SomeClass))
        .allow(Reader.instance).and
    .register(new Veryfay.Read(OtherSomeOtherClass))
        .allow(Reader.instance).deny(Commiter.instance).allow(Reviewer.instance).and;
```

>**Notes:** 
- Roles specified in the same argument list of `allow` or `deny` are bound together by logical *AND*
- Roles specified in separate argument lists of `allow` or `deny` are bound together by logical *OR*


### Verify authorization rules

To verify the authorization rules you may call either: 

- `isAllowing` which returns `isAllowingResult` containing the result of the verification as a bool value and a string with information about the execution of the authorization rules

```typescript
let result = ae.get(new Veryfay.Read(SomeOtherClass)).isAllowing(new OtherPrincipalClass("reader"), [1234, "1234"]);
```
 
- `verify` which returns `string` in case of success, otherwise throwing `AuthorizationException` containing a string with information about the execution of the authorization rules

```typescript
ae.get(new Veryfay.Read(SomeOtherClass)).verify(new OtherPrincipalClass("reader"), [1234, "1234"]);
```

>**Note:** During rules verification, role definitions are matched both by activity type and by the types of the arguments (for principal and optionally extra info) which are passed in to `isAllowing` or `verify`