// Embedded partial
declare type EmbeddedPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<EmbeddedPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<EmbeddedPartial<U>>
    : EmbeddedPartial<T[P]>;
}
