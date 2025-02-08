// Embedded partial
declare type EmbeddedPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<EmbeddedPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<EmbeddedPartial<U>>
    : EmbeddedPartial<T[P]>;
}

/**
 * Tuple with length
 *
 * @param E element
 * @param L length of tuple
 */
declare type Tuple<E, L extends number, Arr = [E, ...Array<E>]> =
    Pick<Arr, Exclude<keyof Arr, 'splice' | 'push' | 'pop' | 'shift' | 'unshift'>>
    & {
        readonly length: L
        [I: number]: E
    }

/**
 * Vector
 *
 * @param D dimension of vector
 */
declare type Vector<D extends number> = Tuple<number, D>

declare type CompareFn<T> = (a: T, b: T) => number