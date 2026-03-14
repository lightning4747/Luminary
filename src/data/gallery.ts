export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  number: string;
  themeText: string;
  orientation: 'portrait' | 'landscape';
}

export const IMAGES: GalleryItem[] = [
  {
    id: "01",
    src: "/images/ball.jpg",
    title: "Obscured Sphere",
    number: "No. 01",
    themeText: "geometry of shadows",
    orientation: 'landscape',
  },
  {
    id: "02",
    src: "/images/butter-fly.jpg",
    title: "Fragile Flight",
    number: "No. 02",
    themeText: "ephemeral grace",
    orientation: 'landscape',
  },
  {
    id: "03",
    src: "/images/fall.jpg",
    title: "Autumn Descent",
    number: "No. 03",
    themeText: "rhythm of decay",
    orientation: 'landscape',
  },
  {
    id: "04",
    src: "/images/forrest.jpg",
    title: "Emerald Silence",
    number: "No. 04",
    themeText: "architecture of trees",
    orientation: 'landscape',
  },
  {
    id: "05",
    src: "/images/gifted.jpg",
    title: "Wrapped Solitude",
    number: "No. 05",
    themeText: "hidden intentions",
    orientation: 'landscape',
  },
  {
    id: "06",
    src: "/images/lightning.jpg",
    title: "Electric Pulse",
    number: "No. 06",
    themeText: "violent illumination",
    orientation: 'landscape',
  },
  {
    id: "07",
    src: "/images/sun.jpg",
    title: "Solar Flare",
    number: "No. 07",
    themeText: "blinding presence",
    orientation: 'landscape',
  },
  {
    id: "08",
    src: "/images/violet.jpg",
    title: "Purple Haze",
    number: "No. 08",
    themeText: "depths of color",
    orientation: 'landscape',
  }
];
