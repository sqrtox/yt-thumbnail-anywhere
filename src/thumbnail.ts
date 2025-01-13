import { createCssClasses, injectCss } from "@src/css.js";
import { loadImage } from "@src/image.js";

export const applySmallThumbnail = async (
  watchId: string,
  largeThumbnail: LargeThumbnailController,
): Promise<void> => {
  const classes = createCssClasses("title", "smallThumbnail");

  injectCss(`
  .${classes.title} {
    display: flex;
    align-items: center;
    column-gap: 1rem;
  }


  .${classes.smallThumbnail} {
      height: 64px;
  }

  .${classes.smallThumbnail}:hover {
    position: relative;
  }

  .${classes.smallThumbnail}:hover::after {
    position: absolute;
    cursor: zoom-in;
    top: 0;
    left: 0;
    content: "";
    backdrop-filter: brightness(0.75);
    width: 100%;
    height: 100%;
  }

  .${classes.smallThumbnail} img {
    height: 100%;
    width: auto;
  }
`);

  const title = document.querySelector("#title:has(> h1)");
  if (!title) {
    return;
  }

  title.classList.add(classes.title);

  const events = new AbortController();
  const smallThumbnail = document.createElement("div");

  smallThumbnail.classList.add(classes.smallThumbnail);
  smallThumbnail.addEventListener(
    "click",
    async () => {
      await largeThumbnail.expand(watchId);
    },
    {
      signal: events.signal,
    },
  );
  title.insertBefore(smallThumbnail, title.firstChild);

  const image = await loadImage(
    `https://i.ytimg.com/vi/${encodeURIComponent(watchId)}/default.jpg`,
  );

  smallThumbnail.append(image);

  const dispose = () => {
    events.abort();
    smallThumbnail.remove();
    title.classList.remove(classes.title);
  };

  document.addEventListener(
    "yt-navigate-finish",
    () => {
      dispose();
    },
    {
      signal: events.signal,
    },
  );
};

export interface LargeThumbnailController {
  expand: (watchId: string) => Promise<void>;
  shrink: () => void;
}

export const createLargeThumbnail = (): LargeThumbnailController => {
  const classes = createCssClasses("hidden", "largeThumbnail");

  injectCss(`
    .${classes.largeThumbnail} {
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      width: 100svw;
      height: 100svh;
      top: 0;
      left: 0;
      cursor: zoom-out;
      backdrop-filter: brightness(0.5);
      z-index: 9999999;
    }

    .${classes.largeThumbnail} img {
      max-width: 50%;
      max-height: 50%;
      width: auto;
      height: auto;
      vertical-align: middle;
    }

    .${classes.hidden} {
      display: none;
    }
  `);

  const largeThumbnail = document.createElement("div");

  largeThumbnail.classList.add(classes.hidden, classes.largeThumbnail);

  const handleClick = (): void => {
    controller.shrink();
  };

  const controller: LargeThumbnailController = {
    expand: async (watchId) => {
      const image = await loadImage(
        `https://i.ytimg.com/vi/${encodeURIComponent(watchId)}/maxresdefault.jpg`,
      );

      document.addEventListener("click", handleClick);
      largeThumbnail.replaceChildren(image);
      largeThumbnail.classList.remove(classes.hidden);
    },
    shrink: () => {
      document.removeEventListener("click", handleClick);
      largeThumbnail.classList.add(classes.hidden);
    },
  };

  document.addEventListener("yt-navigate-start", () => {
    controller.shrink();
  });
  document.body.append(largeThumbnail);

  return controller;
};
