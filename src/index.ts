import { debug } from "./debug.js";
import { css, style } from "./index.css?module";
import { addStyle } from "./style.js";

const main = () => {
    addStyle(css);

    const ytdAppEl = document.getElementsByTagName("ytd-app")[0];

    if (!ytdAppEl) {
        debug("not found: ytd-app");

        return;
    }

    const largeThumbnailContainerEl = document.createElement("dialog");
    const largeThumbnailEl = document.createElement("img");

    largeThumbnailContainerEl.classList.add(style.largeThumbnailContainer);
    largeThumbnailEl.classList.add(style.largeThumbnail);
    largeThumbnailEl.decoding = "async";
    largeThumbnailEl.loading = "lazy";

    largeThumbnailContainerEl.addEventListener("click", () => {
        largeThumbnailContainerEl.close();
    });

    largeThumbnailContainerEl.append(largeThumbnailEl);
    document.body.append(largeThumbnailContainerEl);

    const thumbnailButtonEl = document.createElement("button");
    const smallThumbnailEl = document.createElement("img");

    thumbnailButtonEl.classList.add(style.thumbnailButton);
    smallThumbnailEl.classList.add(style.smallThumbnail);

    thumbnailButtonEl.addEventListener("click", () => {
        largeThumbnailContainerEl.showModal();
    });

    thumbnailButtonEl.append(smallThumbnailEl);

    document.addEventListener("yt-navigate-start", () => {
        largeThumbnailContainerEl.close();
    });

    window.addEventListener("popstate", () => {
        largeThumbnailContainerEl.close();
    });

    ytdAppEl.addEventListener("yt-page-data-fetched", (ev) => {
        largeThumbnailContainerEl.close();

        const { pageData } = (ev as CustomEvent).detail;

        if (pageData.page !== "watch") {
            return;
        }

        const { playerResponse } = pageData;
        const { videoDetails } = playerResponse;

        smallThumbnailEl.src = `https://i.ytimg.com/vi/${encodeURIComponent(videoDetails.videoId)}/default.jpg`;

        interface Thumbnail {
            width: number;
            height: number;
            url: string;
        }

        const largest = videoDetails.thumbnail.thumbnails.sort(
            (a: Thumbnail, b: Thumbnail) =>
                b.width * b.height - a.width * b.height,
        )[0];

        largeThumbnailEl.src = largest.url;
    });

    ytdAppEl.addEventListener("yt-update-title", () => {
        const titleEl = document.querySelector("ytd-watch-metadata #title");
        if (!titleEl) return;

        titleEl.classList.add(style.title);

        if (!thumbnailButtonEl.parentNode) {
            titleEl.insertBefore(thumbnailButtonEl, titleEl.firstChild);
        }
    });
};

main();
