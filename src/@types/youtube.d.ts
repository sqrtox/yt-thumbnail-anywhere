export {};

declare global {
  interface DocumentEventMap {
    "yt-navigate-start": CustomEvent;
    "yt-navigate-finish": CustomEvent;
    "yt-page-data-updated": CustomEvent;
  }
}
