export const loadImage = (src: string): Promise<HTMLImageElement> => {
  const { promise, resolve, reject } =
    Promise.withResolvers<HTMLImageElement>();
  const events = new AbortController();
  const image = document.createElement("img");

  image.addEventListener(
    "load",
    () => {
      events.abort();
      resolve(image);
    },
    {
      signal: events.signal,
    },
  );
  image.addEventListener(
    "error",
    () => {
      events.abort();
      reject();
    },
    {
      signal: events.signal,
    },
  );

  image.src = src;

  return promise;
};
