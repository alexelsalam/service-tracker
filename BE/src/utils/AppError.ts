export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  // 4xx — Client Error
  static badRequest(message: string) {
    return new AppError(message, 400); // input salah
  }

  static unauthorized(message: string) {
    return new AppError(message, 401); // belum login
  }

  static forbidden(message: string) {
    return new AppError(message, 403); // tidak punya akses
  }

  static notFound(message: string) {
    return new AppError(message, 404); // data tidak ada
  }

  static conflict(message: string) {
    return new AppError(message, 409); // data duplikat
  }

  // 5xx — Server Error
  static internal(message: string) {
    return new AppError(message, 500); // error server
  }
}
