import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

// Satori can't read CSS variables, so these mirror tokens.css by value.
const GROUND = '#f8f8f6';
const INK = '#161613';
const ACCENT = '#2f6b54';
const ACCENT_SOFT = '#9ab8aa';

const WIDTH = 1200;
const HEIGHT = 630;
const INSET = 88;
// LinkedIn shows previews shrunk to 480px wide, so type is sized to stay legible there.
const TITLE_SIZE = 96;
const DOMAIN_SIZE = 48;

const fontPath = join(
  process.cwd(),
  'node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff'
);

/** A post's link-preview card: its title, and the domain with the brand's cursor. */
export async function renderPostImage(title: string): Promise<Uint8Array<ArrayBuffer>> {
  const font = await readFile(fontPath);

  const heading = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        maxWidth: WIDTH - 2 * INSET,
        fontSize: TITLE_SIZE,
        lineHeight: 1.15,
        color: INK,
      },
      // One box per word, so a hyphenated word never breaks across lines.
      children: title.split(' ').map((word) => ({
        type: 'div',
        props: { style: { marginRight: TITLE_SIZE * 0.26 }, children: word },
      })),
    },
  };

  const domain = {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', fontSize: DOMAIN_SIZE, color: ACCENT },
      children: [
        'alex-ak.com',
        { type: 'div', props: { style: { width: 4, height: DOMAIN_SIZE * 1.2, marginLeft: 8, background: ACCENT_SOFT } } },
      ],
    },
  };

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { width: '100%', height: '100%', display: 'flex', background: GROUND, fontFamily: 'Newsreader' },
        // Satori adds padding outside a box's size, so the inset is a margin on a stretched child.
        children: {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flexGrow: 1,
              margin: INSET,
            },
            children: [heading, domain],
          },
        },
      },
    },
    { width: WIDTH, height: HEIGHT, fonts: [{ name: 'Newsreader', data: font, weight: 400 }] }
  );

  return new Uint8Array(new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng());
}
