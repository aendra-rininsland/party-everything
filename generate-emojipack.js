/**
 * @file
 * Generates an emojipack YAML file, suitable for use with slack-emoji-import
 * @see https://github.com/itslenny/slack-emoji-import
 */

const { writeFileSync } = require('fs');
const glob = require('glob');
const { basename } = require('path');

const emojis = glob.sync('./emoji/*.png');

const output = `title: party-everything
emojis:
${emojis
    .filter(d => !/party-1F\d.+/.test(d))
    .map(
      d => `  - name: ${basename(d, '.png')}
    src: https://raw.githubusercontent.com/aendrew/party-everything/master/emoji/${basename(d)}`,
    )
    .join('\n')}`;

writeFileSync('./emojipack.yaml', output, 'utf-8');
