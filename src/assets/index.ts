/**
 * Single re-export point for the Codex asset contract.
 * ONLY the fixed contract names exist on disk — never invent another one.
 */
export const bgGame = require('../../assets/bg_game.png');
export const logo = require('../../assets/logo.png');
export const iconHome = require('../../assets/icon_home.png');
export const iconPause = require('../../assets/icon_pause.png');
export const sprite1 = require('../../assets/sprite_1.png');
export const sprite2 = require('../../assets/sprite_2.png');
export const sprite3 = require('../../assets/sprite_3.png');
export const sprite4 = require('../../assets/sprite_4.png');
export const sprite5 = require('../../assets/sprite_5.png');
export const buttonRect = require('../../assets/button_rect.png');
export const buttonRound = require('../../assets/button_round.png');

export const SPRITES = [sprite1, sprite2, sprite3, sprite4, sprite5];

export default {
  bgGame,
  logo,
  iconHome,
  iconPause,
  sprite1,
  sprite2,
  sprite3,
  sprite4,
  sprite5,
  buttonRect,
  buttonRound,
  SPRITES,
};
