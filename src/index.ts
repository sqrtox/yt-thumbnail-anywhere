import { applySmallThumbnail, createLargeThumbnail } from "#src/thumbnail.js";

const largeThumbnail = createLargeThumbnail();

const apply = async (): Promise<void> => {
  let watchId: string | undefined;

  if (location.pathname.startsWith("/live/")) {
    watchId = location.pathname.split("/").pop();
  } else {
    const searchParams = new URLSearchParams(location.search);

    watchId = searchParams.get("v") ?? undefined;
  }

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
