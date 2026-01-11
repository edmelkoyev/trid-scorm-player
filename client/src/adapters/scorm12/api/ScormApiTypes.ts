export interface IScormAPI {
    LMSInitialize(param: string): string;
    LMSFinish(param: string): string;
    LMSGetValue(element: string): string;
    LMSSetValue(element: string, value: string): string;
    LMSCommit(param: string): string;
    LMSGetLastError(): string;
    LMSGetErrorString(code: string): string;
    LMSGetDiagnostic(code: string): string;
}