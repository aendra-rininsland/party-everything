#!/usr/bin/env node
/**
 * @file
 * This turns any PNG into a Party Parrot gif.
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const { basename } = require('path');
const UPNG = require('upng-js');
const meow = require('meow');

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

const cli = meow(
  `
    Usage
      $ partyizer <path to png> [output filename]
 
    Options
      --width, -w  Specify width in px (default: 64)
      --height, -h  Specify height in px (default: 64)
 
    Examples
      $ partyizer unicorns.png
`,
  {
    flags: {
      width: {
        type: 'number',
        alias: 'w',
      },
      height: {
        type: 'number',
        alias: 'h',
      },
    },
  },
);

const [emoji, output] = cli.input;

loadImage(emoji).then((img) => {
  const imgs = [];
  const w = cli.flags.width || 64;
  const h = cli.flags.height || 64;

  for (const base of PARROT_COLORS) {
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = base;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, w, h);
    imgs.push(ctx.getImageData(0, 0, w, h).data.buffer);
  }

  const apng = UPNG.encode(imgs, w, h, 0, Array(PARROT_COLORS.length).fill(50));

  fs.writeFileSync(output || `${process.cwd()}/party-${basename(emoji)}`, new Uint8Array(apng));
});
