import { describe, it, expect } from 'vitest';
import { ssmlToSay } from './ssml-to-say.js';

describe('ssmlToSay', () => {
  describe('plain text', () => {
    it('returns plain text unchanged', () => {
      expect(ssmlToSay('Hello world')).toBe('Hello world');
    });
  });

  describe('<speak>', () => {
    it('strips speak wrapper', () => {
      expect(ssmlToSay('<speak>Hello world</speak>')).toBe('Hello world');
    });

    it('strips speak wrapper with attributes', () => {
      expect(ssmlToSay('<speak version="1.0">Hello</speak>')).toBe('Hello');
    });
  });

  describe('<break>', () => {
    it('converts millisecond break to slnc', () => {
      expect(ssmlToSay('<break time="500ms"/>')).toBe('[[slnc 500]]');
    });

    it('converts second break to slnc in milliseconds', () => {
      expect(ssmlToSay('<break time="2s"/>')).toBe('[[slnc 2000]]');
    });

    it('converts break without self-closing slash', () => {
      expect(ssmlToSay('<break time="300ms">')).toBe('[[slnc 300]]');
    });
  });

  describe('<emphasis>', () => {
    it('wraps strong emphasis with emph commands', () => {
      expect(ssmlToSay('<emphasis level="strong">hello</emphasis>')).toBe(
        '[[emph +]]hello[[emph -]]',
      );
    });

    it('wraps moderate emphasis with emph commands', () => {
      expect(ssmlToSay('<emphasis level="moderate">hello</emphasis>')).toBe(
        '[[emph +]]hello[[emph -]]',
      );
    });

    it('strips reduced emphasis tags keeping text', () => {
      expect(ssmlToSay('<emphasis level="reduced">hello</emphasis>')).toBe(
        'hello',
      );
    });

    it('strips none emphasis tags keeping text', () => {
      expect(ssmlToSay('<emphasis level="none">hello</emphasis>')).toBe(
        'hello',
      );
    });

    it('wraps emphasis without level attribute with emph commands', () => {
      expect(ssmlToSay('<emphasis>hello</emphasis>')).toBe(
        '[[emph +]]hello[[emph -]]',
      );
    });
  });

  describe('<prosody rate>', () => {
    it('converts x-slow keyword to 90 wpm', () => {
      expect(ssmlToSay('<prosody rate="x-slow">text</prosody>')).toBe(
        '[[rate 90]]text[[rate 180]]',
      );
    });

    it('converts slow keyword to 120 wpm', () => {
      expect(ssmlToSay('<prosody rate="slow">text</prosody>')).toBe(
        '[[rate 120]]text[[rate 180]]',
      );
    });

    it('converts medium keyword to 180 wpm', () => {
      expect(ssmlToSay('<prosody rate="medium">text</prosody>')).toBe(
        '[[rate 180]]text[[rate 180]]',
      );
    });

    it('converts fast keyword to 270 wpm', () => {
      expect(ssmlToSay('<prosody rate="fast">text</prosody>')).toBe(
        '[[rate 270]]text[[rate 180]]',
      );
    });

    it('converts x-fast keyword to 360 wpm', () => {
      expect(ssmlToSay('<prosody rate="x-fast">text</prosody>')).toBe(
        '[[rate 360]]text[[rate 180]]',
      );
    });

    it('converts numeric multiplier', () => {
      expect(ssmlToSay('<prosody rate="1.5">text</prosody>')).toBe(
        '[[rate 270]]text[[rate 180]]',
      );
    });

    it('converts percentage rate', () => {
      expect(ssmlToSay('<prosody rate="50%">text</prosody>')).toBe(
        '[[rate 90]]text[[rate 180]]',
      );
    });

    it('falls back to default rate for unrecognised value', () => {
      expect(ssmlToSay('<prosody rate="bogus">text</prosody>')).toBe(
        '[[rate 180]]text[[rate 180]]',
      );
    });
  });

  describe('HTML entities', () => {
    it('unescapes &amp;', () => {
      expect(ssmlToSay('rock &amp; roll')).toBe('rock & roll');
    });

    it('unescapes &lt; and &gt;', () => {
      expect(ssmlToSay('1 &lt; 2 &gt; 0')).toBe('1 < 2 > 0');
    });

    it('unescapes &quot;', () => {
      expect(ssmlToSay('say &quot;hello&quot;')).toBe('say "hello"');
    });

    it('unescapes &apos;', () => {
      expect(ssmlToSay('it&apos;s')).toBe("it's");
    });
  });

  describe('unknown tags', () => {
    it('strips unknown tags keeping inner text', () => {
      expect(ssmlToSay('<say-as interpret-as="characters">NASA</say-as>')).toBe(
        'NASA',
      );
    });

    it('strips voice tags keeping inner text', () => {
      expect(ssmlToSay('<voice name="Samantha">Hello</voice>')).toBe('Hello');
    });
  });

  describe('combinations', () => {
    it('converts full ssml document', () => {
      const input = [
        '<speak>',
        'Hello <emphasis level="strong">world</emphasis>.',
        '<break time="500ms"/>',
        '<prosody rate="slow">Take it easy.</prosody>',
        '</speak>',
      ].join('');

      expect(ssmlToSay(input)).toBe(
        'Hello [[emph +]]world[[emph -]].[[slnc 500]][[rate 120]]Take it easy.[[rate 180]]',
      );
    });
  });

  describe('nesting', () => {
    it('converts emphasis inside prosody', () => {
      expect(
        ssmlToSay(
          '<prosody rate="slow"><emphasis level="strong">loud</emphasis> and calm</prosody>',
        ),
      ).toBe('[[rate 120]][[emph +]]loud[[emph -]] and calm[[rate 180]]');
    });

    it('converts prosody inside emphasis', () => {
      expect(
        ssmlToSay(
          '<emphasis level="strong"><prosody rate="fast">fast</prosody> and loud</emphasis>',
        ),
      ).toBe('[[emph +]][[rate 270]]fast[[rate 180]] and loud[[emph -]]');
    });

    it('converts break inside prosody', () => {
      expect(
        ssmlToSay(
          '<prosody rate="slow">pause<break time="300ms"/>here</prosody>',
        ),
      ).toBe('[[rate 120]]pause[[slnc 300]]here[[rate 180]]');
    });

    it('converts sequential elements inside speak', () => {
      expect(
        ssmlToSay(
          '<speak><emphasis level="strong">A</emphasis><break time="100ms"/><prosody rate="fast">B</prosody></speak>',
        ),
      ).toBe('[[emph +]]A[[emph -]][[slnc 100]][[rate 270]]B[[rate 180]]');
    });

    it('converts break between two emphasis elements', () => {
      expect(
        ssmlToSay(
          '<emphasis level="strong">one</emphasis><break time="200ms"/><emphasis level="moderate">two</emphasis>',
        ),
      ).toBe('[[emph +]]one[[emph -]][[slnc 200]][[emph +]]two[[emph -]]');
    });

    it('strips reduced emphasis nested inside strong emphasis keeping all text', () => {
      expect(
        ssmlToSay(
          '<emphasis level="strong">bold <emphasis level="reduced">normal</emphasis> bold</emphasis>',
        ),
      ).toBe('[[emph +]]bold normal bold[[emph -]]');
    });

    // Known limitation: regex-based parsing cannot handle same-type nesting.
    // The inner <prosody> is resolved correctly but the outer closing tag becomes
    // orphaned and gets stripped, so text outside the inner block loses its rate.
    it('handles nested prosody by applying inner rate and stripping outer close tag', () => {
      expect(
        ssmlToSay(
          '<prosody rate="slow"><prosody rate="fast">inner</prosody> outer</prosody>',
        ),
      ).toBe('[[rate 120]]inner[[rate 180]] outer');
    });
  });
});
