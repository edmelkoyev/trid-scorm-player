export enum ScormErrorCode {
    NoError = 0,
    InvalidArgument = 201,
    NotInitialized = 301,
    ReadOnly = 403,
    NotImplemented = 404
}

export const ScormErrorStrings: Record<number, string> = {
    0: "No error",
    201: "Invalid argument",
    301: "Not initialized",
    403: "Element is read-only",
    404: "Element not implemented"
};
