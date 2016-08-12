namespace VeryfayIntern.Error {

    export class AuthorizationException extends Exception {
        constructor(msg: string) {
            super('Authorization Exception', msg);
        }
    }

}