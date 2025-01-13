import { applySmallThumbnail, createLargeThumbnail } from "#src/thumbnail.js";

const largeThumbnail = createLargeThumbnail();

const apply = async (): Promise<void> => {
  const searchParams = new URLSearchParams(location.search);
  const watchId = searchParams.get("v");

  if (!watchId) {
    return;
  }

  await applySmallThumbnail(watchId, largeThumbnail);
};

document.addEventListener("yt-page-data-updated", async (event) => {
  if (event.detail.pageType !== "watch") {
    return;
  }

  await apply();
});

await apply();
