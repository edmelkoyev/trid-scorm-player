export enum ScormErrorCode {
  NoError = 0,
  GeneralException = 101,
  InvalidArgument = 201,
  ElementCanNotHaveChildren = 202,
  ElementNotAnArray = 203,
  NotInitialized = 301,
  NotImplementedError = 401,
  InvalidSetValue = 402,
  ReadOnly = 403,
  WriteOnly = 404,
  IncorrectDataType = 405
}

export type ScormErrorCodeType = typeof ScormErrorCode[keyof typeof ScormErrorCode];

export const ScormErrorStrings: Record<number, string> = {
  0: 'No error',
  101: 'General Exception',
  201: 'Invalid argument error',
  202: 'Element cannot have children',
  203: 'Element not an array - cannot have count',
  301: 'Not initialized',
  401: 'Not Implemented Error',
  402: 'Invalid Set Value, element is a keyword',
  403: 'Element is read only',
  404: 'Element is write only',
  405: 'Incorrect data type',
};
