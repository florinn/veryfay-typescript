namespace VeryfayIntern.Common {

    export type Ctor<T> = {
        new (): T;
        prototype: Object;
    }

} 
