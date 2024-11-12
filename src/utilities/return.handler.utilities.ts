class ReturnObjectHandler<T> {
  message: string;
  returnValue?: T;
  statusCode?: number;

  constructor(message: string, returnValue?: T, statusCode?: number) {
    this.message = message;
    this.returnValue = returnValue;
    this.statusCode = statusCode;
  }

  getMessage(): string {
    return this.message;
  }

  getReturnValue(): T | null {
    return this.returnValue;
  }

  getStatusCode(): number | null {
    return this.statusCode;
  }
  setMessage(message: string): void {
    this.message = message;
  }

  setReturnValue(value: T): void {
    this.returnValue = value;
  }

  setStatusCode(statusCode: number): void {
    this.statusCode = statusCode;
  }
}

export default ReturnObjectHandler;
