export const addStyle = (css: string): HTMLStyleElement => {
    const styleEl = document.createElement("style");

    styleEl.textContent = css;

    document.head.append(styleEl);

    return styleEl;
};
