export type Success<T> = {
  success: true;
  data: T;
};

export type Failure = {
  success: false;
  error: string;
};

export type Result<T> = Success<T> | Failure;

export default async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage: string = "Something went wrong",
): Promise<Result<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error: any) {
    console.error(errorMessage, error);
    return { success: false, error: errorMessage };
  }
}
