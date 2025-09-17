import tryCatch, { Result } from "./try-catch";

export default async function fetchData<T>(
  url: string,
  withCredentials: boolean,
): Promise<Result<T>> {
  return tryCatch(async () => {
    const response = await fetch(url, {
      credentials: withCredentials ? "include" : "omit",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as T;
  }, "Failed to fetch data");
}
