export class BadRequestException extends Error {
  public statusCode: number;
  constructor(message: string = "Bad Request! Please check your input") {
    super(message);
    this.statusCode = 400;
  }
}

export class NotFoundException extends Error {
  public statusCode: number;
  constructor(message: string = "Not Found! Please check your input") {
    super(message);
    this.statusCode = 404;
  }
}
