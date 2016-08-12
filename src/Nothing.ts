namespace VeryfayIntern {

    export class Nothing {
        private static _atAll = new Nothing();
        constructor() {
            if (Nothing._atAll)
                throw new Error.Exception("instantiation failed: use .atAll instead of new");
            Nothing._atAll = this;
        }
        static get atAll(): Nothing { return Nothing._atAll; }
    }

}