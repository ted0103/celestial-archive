let deckArtwork = null;

const BASE_ARTWORK_WIDTH = 1448;
const BASE_ARTWORK_HEIGHT = 1086;

const MINOR_COLUMNS = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 11,
  11: 12,
  12: 13,
  13: 14,
  14: 15,
};

const MINOR_ROWS = {
  wands: {y: 447, height: 140},
  cups: {y: 595, height: 137},
  swords: {y: 741, height: 137},
  pentacles: {y: 883, height: 133},
};

export const loadDeckArtwork = (source) => new Promise((resolve, reject) => {
  if (deckArtwork?.complete) {
    resolve(deckArtwork);
    return;
  }
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    deckArtwork = image;
    resolve(image);
  };
  image.onerror = () => reject(new Error(`Unable to load local deck artwork: ${source}`));
  image.src = source;
});

const cropFor = (card) => {
  if (card.group === 'major') {
    if (card.number <= 11) {
      return {
        x: Math.round(39 + card.number * 114.15),
        y: 84,
        width: 101,
        height: 168,
      };
    }
    return {
      x: Math.round(80 + (card.number - 12) * 129.25),
      y: 259,
      width: 105,
      height: 164,
    };
  }

  const row = MINOR_ROWS[card.suit];
  const column = card.suit === 'pentacles' && card.rankIndex === 9
    ? 10
    : MINOR_COLUMNS[card.rankIndex];
  return {
    x: Math.round(34 + column * 86.05),
    y: row.y,
    width: 78,
    height: row.height,
  };
};

export const renderCard = (canvas, card, options = {}) => {
  if (!deckArtwork?.complete) throw new Error('Deck artwork must be loaded before rendering cards.');
  const crop = cropFor(card);
  const width = options.width || 768;
  const height = Math.round(width * (crop.height / crop.width));
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', {alpha: false});
  const sourceScaleX = deckArtwork.naturalWidth / BASE_ARTWORK_WIDTH;
  const sourceScaleY = deckArtwork.naturalHeight / BASE_ARTWORK_HEIGHT;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#050706';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(
    deckArtwork,
    crop.x * sourceScaleX,
    crop.y * sourceScaleY,
    crop.width * sourceScaleX,
    crop.height * sourceScaleY,
    0,
    0,
    width,
    height,
  );
  return canvas;
};

export const getCardCrop = (card) => ({...cropFor(card)});
