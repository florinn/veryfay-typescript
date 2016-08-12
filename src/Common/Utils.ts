namespace VeryfayIntern.Common {

    export class Utils {

        static typeName(inst: any): string {
            let ret: string; 
            if (typeof inst === "object")
                ret = Utils.functionName((<Object>inst).constructor);
            else
                ret = typeof inst;
            return ret;
        }

        static functionName(fun: Object): string {
            let ret: string;
            if ((<any>fun).name) {
                ret = (<any>fun).name;
            } else {
                let repr = fun.toString();
                repr = repr.substr('function '.length);
                ret = repr.substr(0, repr.indexOf('('));
            }
            return ret;
        }

        static applyMixins(derivedCtor: any, baseCtors: any[]) {
            baseCtors.forEach(baseCtor => {
                Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                });
            });
        }

    }

}