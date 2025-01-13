const CSS_CLASS_PREFIX = "userscript-";

export const createCssClasses = <const T extends readonly string[]>(
  ...classes: T
  // @ts-expect-error: TODO: reason
): { [I in Exclude<keyof T, "length"> as T[I]]: string } => {
  const result: Record<string, string> = {};

  for (const class_ of classes) {
    result[class_] =
      `${CSS_CLASS_PREFIX}${Math.random().toString(36).slice(2)}`;
  }

  return result as ReturnType<typeof createCssClasses<T>>;
};

export const injectCss = (css: string) => {
  const style = document.createElement("style");

  style.setHTMLUnsafe(css);

  document.head.append(style);
};
