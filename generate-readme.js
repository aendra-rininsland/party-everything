/**
 * @file
 * Generates the README
 */

const { basename } = require('path');
const glob = require('glob');
const { writeFileSync } = require('fs');

// Generate README
const README = `# Party Everything

This is literally every single emoji done with a
[Cult Of The Party Parrot][1] rainbow interpolator.

## Emoji Table

|     shortcode     |  preview  |
|-------------------|-----------|
${glob
    .sync('./emoji/*.png')
    .map(e => `| :${basename(e, '.png')}: | ![:${basename(e, '.png')}:](${e}) |`)
    .join('\n')}

## Create your own!

\`\`\`bash
$ npx party-everything input.png output.png
\`\`\`

## Todo

- Improve automatic naming

## Credits

- https://www.npmjs.com/package/emoji-datasource
- https://github.com/github/gemoji

[1]: https://www.cultofthepartyparrot.com
`;

writeFileSync('./README.md', README, 'utf-8');
