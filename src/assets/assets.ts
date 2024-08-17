import { Image, SpriteSheet, Audio } from './util';
import { image, sound, music, loadFont, spritesheet } from './util';

/* Images */
const images: Image[] = [
	// Backgrounds
	image('backgrounds/background', 'background'),
	image('backgrounds/playarea-base', 'playArea_base'),

	// Characters
	image('characters/player', 'player'),
	image('characters/worker', 'worker'),

	// Items
	image('items/coin', 'coin'),

	// UI
	image('ui/hud', 'hud'),
	image('ui/bubble', 'bubble'),
	image('ui/timer', 'timer'),

	// Titlescreen
	image('titlescreen/sky', 'title_sky'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/character', 'title_character'),



];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	//temp
	spritesheet('temp/invbutton', 'invbutton', 128, 128),
];

/* Audios */
const audios: Audio[] = [
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	sound('tree/rustle', 't_rustle', 0.5),
];

/* Fonts */
await loadFont('Sketch', 'Game Font');

export {
	images,
	spritesheets,
	audios
};