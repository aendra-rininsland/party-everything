/**
 * @file
 * This party parrots all the things.
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const { basename } = require('path');
const glob = require('glob');
const UPNG = require('upng-js');
const emojiData = require('./emoji.json');

const w = 64;
const h = 64;

const PARROT_COLORS = [
  '#FDD58E',
  '#8CFD8E',
  '#8CFFFE',
  '#8DB6FB',
  '#D690FC',
  '#FD90FD',
  '#FD6EF4',
  '#FC6FB6',
  '#FD6A6B',
  '#FD8E8D',
];

(async () => {
  const emojis = glob.sync('./sources/unicode/*.png');
  /* eslint-disable no-restricted-syntax,no-await-in-loop */
  let i = 0;
  for (const emoji of emojis) {
    const nonQualified = basename(emoji, '.png').toUpperCase();
    const { short_name = nonQualified } = emojiData.find(d => d.non_qualified === nonQualified)
      || emojiData.find(d => d.unified === nonQualified)
      || {};
    console.log(`On ${short_name} (${++i}/${emojis.length})`);
    const img = await loadImage(emoji);
    const modes = [
      // 'luminosity',
      // 'color',
      // 'saturation',
      // 'hue',
      // 'exclusion',
      // 'difference',
      // 'soft-light',
      // 'hard-light',
      // 'color-burn',
      // 'color-dodge',
      // 'lighten',
      // 'darken',
      // 'overlay',
      // 'screen',
      // 'multiply',
      // 'xor',
      // 'copy',
      // 'lighter',
      // 'destination-atop',
      // 'destination-out',
      // 'destination-in',
      // 'destination-over',
      'source-atop',
      // 'source-out',
      // 'source-in',
      // 'source-over',
    ];
    for (const mode of modes) {
      const imgs = [];
      for (const base of PARROT_COLORS) {
        const canvas = createCanvas(w, h);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);
        // ctx.filter = 'grayscale(100%)';
        ctx.globalCompositeOperation = mode;
        ctx.fillStyle = base;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, w, h);
        imgs.push(ctx.getImageData(0, 0, w, h).data.buffer);
      }

      const apng = UPNG.encode(imgs, w, h, 0, Array(PARROT_COLORS.length).fill(50));

      fs.writeFileSync(`${__dirname}/emoji/party-${short_name}.png`, new Uint8Array(apng));
    }
  }
  //   // while (String.fromCharCode(i) !== '\u0000') {
  //   while (i < 0x1f980) {
  //     const img = await loadImage('emoji/');
  //     const canvas = createCanvas(w, h);
  //     const ctx = canvas.getContext('2d');

  //     ctx.font = '48px sans-serif';
  //     ctx.textAlign = 'center';
  //     ctx.textBaseline = 'middle';
  //     ctx.fillText(String.fromCharCode(i), w / 2, h / 2);
  //     const stream = canvas.createPNGStream();
  //     const out = fs.createWriteStream(`${__dirname}/out/${i}.png`);
  //     stream.pipe(out);
  //     out.on('finish', () => console.log('The PNG file was created.'));
  //     i++;
  //   }
})();
