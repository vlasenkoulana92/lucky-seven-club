import fs from 'fs';
import path from 'path';

const ROOT = path.join(__dirname, '..');
const APP = fs.readFileSync(path.join(ROOT, 'App.tsx'), 'utf8');
const SCREEN_DIR = path.join(ROOT, 'src', 'screens');

describe('navigation', () => {
  it('owns the current screen in one state machine, not a navigation library', () => {
    expect(APP).toMatch(/useState<Screen>/);
    expect(APP).not.toMatch(/@react-navigation/);
    expect(APP).not.toMatch(/createStackNavigator|NavigationContainer/);
  });

  it('declares every screen of the brief in the union', () => {
    [
      'loader',
      'menu',
      'game',
      'result',
      'challenge',
      'progress',
      'collection',
      'daily',
      'settings',
    ].forEach(name => {
      expect(APP).toContain("| '" + name + "'");
    });
  });

  it('renders a discrete result screen reachable from the game', () => {
    expect(APP).toContain('<ResultScreen');
    expect(APP).toContain('onGameOver={openResult}');
    const game = fs.readFileSync(path.join(SCREEN_DIR, 'GameScreen.tsx'), 'utf8');
    expect(game).toMatch(/onGameOver\(/);
  });

  it('maps system Back to the menu and lets Back on Menu close the app', () => {
    expect(APP).toContain("BackHandler.addEventListener('hardwareBackPress'");
    expect(APP).toMatch(/current === 'menu'[\s\S]{0,80}return false/);
  });

  it('gives every screen file a route back to the menu', () => {
    fs.readdirSync(SCREEN_DIR)
      .filter(f => f.endsWith('.tsx') && f !== 'LoaderScreen.tsx' && f !== 'MenuScreen.tsx')
      .forEach(file => {
        const text = fs.readFileSync(path.join(SCREEN_DIR, file), 'utf8');
        expect(text).toMatch(/onHome|onMenu|label="MENU"/);
      });
  });

  it('reaches every secondary screen in one tap from the menu', () => {
    const menu = fs.readFileSync(path.join(SCREEN_DIR, 'MenuScreen.tsx'), 'utf8');
    ['CHALLENGE', 'DAILY MODE', 'COLLECTION', 'PROGRESS', 'SETTINGS', 'HOW TO PLAY'].forEach(
      label => {
        expect(menu).toContain('label="' + label + '"');
      },
    );
    expect(menu).toContain('label="PLAY NOW"');
  });
});
