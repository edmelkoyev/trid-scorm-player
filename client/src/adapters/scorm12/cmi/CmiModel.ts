import { CmiValidator } from "./CmiValidator";

export class CmiModel {
  private data: Record<string, string>;

  constructor(initial: Record<string, string>) {
    this.data = { ...initial };
  }

  getValue(key: string): string | undefined {
    return this.data[key];
  }

  setValue(key: string, value: string): boolean {
    if (!CmiValidator.validateSet(key, value)) {
      return false;
    }
    this.data[key] = value;
    return true;
  }

  setSystemValue(key: string, value: string): boolean {
    this.data[key] = value;
    return true;
  }

  snapshot(): Record<string, string> {
    return { ...this.data };
  }
}
