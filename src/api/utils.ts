export type Result<T> = {
    success: boolean
} & (
    | {
          message: null;
          data: T;
      }
    | {
          message: string;
          data: null;
      }
)

export class ResultUtil {
    static success<T>(data: T): Result<T> {
        return {
            success: true,
            message: null,
            data,
        }
    }

    static error<T>(message?: string): Result<T> {
        if (!message) {
            message = "Unknown Error"
        }
        return {
            success: false,
            message,
            data: null,
        }
    }
}
