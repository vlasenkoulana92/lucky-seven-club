import fs from 'fs';
import path from 'path';
import { textTone } from '../src/constants/theme';

const ROOT = path.join(__dirname, '..');
const DIRS = [path.join(ROOT, 'src', 'screens'), path.join(ROOT, 'src', 'components')];

function files(): string[] {
  const out: string[] = [];
  DIRS.forEach(dir => {
    fs.readdirSync(dir)
      .filter(f => f.endsWith('.tsx'))
      .forEach(f => out.push(path.join(dir, f)));
  });
  return out;
}

describe('accessibility and touch', () => {
  it('uses Pressable everywhere, never TouchableOpacity', () => {
    files().forEach(file => {
      expect(fs.readFileSync(file, 'utf8')).not.toContain('TouchableOpacity');
    });
  });

  it('gives every Pressable an accessibility label and a hit slop', () => {
    files().forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      const presses = (text.match(/<Pressable/g) || []).length;
      if (presses === 0) {
        return;
      }
      const labels = (text.match(/accessibilityLabel=/g) || []).length;
      const slops = (text.match(/hitSlop=/g) || []).length;
      expect(labels).toBeGreaterThanOrEqual(presses);
      expect(slops).toBeGreaterThanOrEqual(presses);
    });
  });

  it('never native-drives a layout property', () => {
    files().forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      const lines = text.split('\n');
      lines.forEach(line => {
        if (/useNativeDriver:\s*true/.test(line)) {
          expect(line).not.toMatch(/\b(width|height|margin|padding|top|bottom|left|right)\b\s*:/);
        }
      });
    });
  });

  it('puts pointerEvents box-none on every Animated.View that wraps a button', () => {
    files().forEach(file => {
      const text = fs.readFileSync(file, 'utf8');
      const blocks = text.split('<Animated.View').slice(1);
      blocks.forEach(block => {
        // stop at the closing tag, or at the first self-closing child
        const closeAt = block.indexOf('</Animated.View>');
        const selfAt = block.indexOf('/>');
        const ends = [closeAt, selfAt].filter(i => i >= 0);
        const head = ends.length ? block.slice(0, Math.min(...ends)) : block;
        if (/<(Pressable|PrimaryButton|SecondaryButton|NavPill)/.test(head)) {
          expect(head).toContain('box-none');
        }
      });
    });
  });

  it('raises contrast and keeps a readable floor when high contrast is on', () => {
    expect(textTone(false).primary).not.toBe(textTone(true).primary);
    expect(textTone(true).primary).toBe('#FFFFFF');
  });
});
