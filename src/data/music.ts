import type { MediaItem } from "./media";

export type Jam = MediaItem & { artist: string };

// Placeholder set until real cover art + names/artists are shared. Slugs use
// jam_1, jam_2, ... per instruction. All covers are square (1080x1080) —
// update width/height here if any real asset isn't actually square, since
// InfiniteScene sizes each plane off these values and a wrong aspect ratio
// will visibly stretch the image.
export const jams: Jam[] = [
    { slug: "jam_1", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_1.jpg", width: 1080, height: 1080 },
    { slug: "jam_2", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_2.jpg", width: 1080, height: 1080 },
    { slug: "jam_3", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_3.jpg", width: 1080, height: 1080 },
    { slug: "jam_4", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_4.jpg", width: 1080, height: 1080 },
    { slug: "jam_5", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_5.jpg", width: 1080, height: 1080 },
    { slug: "jam_6", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_6.jpg", width: 1080, height: 1080 },
    { slug: "jam_7", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_7.jpg", width: 1080, height: 1080 },
    { slug: "jam_8", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_8.jpg", width: 1080, height: 1080 },
    { slug: "jam_9", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_9.jpg", width: 1080, height: 1080 },
    { slug: "jam_10", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_10.jpg", width: 1080, height: 1080 },
    { slug: "jam_11", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_11.jpg", width: 1080, height: 1080 },
    { slug: "jam_12", name: "NAME", artist: "ARTIST", description: "TODO: add description", url: "/music/jam_12.jpg", width: 1080, height: 1080 },
];