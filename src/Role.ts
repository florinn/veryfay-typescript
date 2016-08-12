namespace VeryfayIntern {

    export abstract class Role<TPrincipal, TExtraInfo> {
        abstract principal(): TPrincipal;
        abstract extraInfo(): TExtraInfo;
        abstract contains(principal: TPrincipal, extraInfo?: TExtraInfo): boolean;
    }

}