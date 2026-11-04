export const debug = (message: string): void => {
    if (import.meta.env.DEV) {
        console.warn(message);
    }
};
