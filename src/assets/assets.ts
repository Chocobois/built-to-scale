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
	image('characters/smallCWalk1', 'small_customer_walk1'),
	image('characters/medCWalk1', 'medium_customer_walk1'),
	image('characters/largeCWalk1', 'large_customer_walk1'),

	// Items
	image('items/coin', 'coin'),
	image('items/bath1', 'bath_1'),
	image('items/bath2', 'bath_2'),
	image('items/bath3', 'bath_3'),
	image('items/wax1', 'wax_1'),
	image('items/wax2', 'wax_2'),
	image('items/wax3', 'wax_3'),
	image('items/nail1', 'nail_1'),
	image('items/nail2', 'nail_2'),
	image('items/nail3', 'nail_3'),
	image('items/waitchair1', 'waitchair_1'),
	image('items/waitchair2', 'waitchair_2'),
	image('items/waitchair3', 'waitchair_3'),
	image('items/checkout', 'checkout'),

	// UI
	image('ui/hud', 'hud'),
	image('ui/bubble', 'bubble'),
	image('ui/exclamation', 'exclamation'),
	image('ui/timer', 'timer'),

	// Titlescreen
	image('titlescreen/sky', 'title_sky'),
	image('titlescreen/background', 'title_background'),
	image('titlescreen/foreground', 'title_foreground'),
	image('titlescreen/character', 'title_character'),

	//temp
	image('temp/invwindow', 'invwindow'),

];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	//temp
	spritesheet('temp/invbutton', 'invbutton', 128, 128),
	spritesheet('temp/fwbutton', 'fwbutton', 64, 262),
	spritesheet('temp/rock', 'rock', 100, 100),
	spritesheet('temp/coke', 'coke', 100, 100),
	spritesheet('temp/brocc', 'brocc', 100, 100),
	spritesheet('temp/hotdog', 'hotdog', 100, 100),
	spritesheet('temp/hourglass', 'hourglass', 100, 100),
	spritesheet('temp/hypnosis', 'hypnosis', 100, 100),
	spritesheet('temp/milk', 'milk', 100, 100),
	spritesheet('temp/pocky', 'pocky', 100, 100),
	spritesheet('temp/polish', 'polish', 100, 100),
	spritesheet('temp/snowglobe', 'snowglobe', 100, 100),
	spritesheet('temp/usb', 'usb', 100, 100),
	spritesheet('temp/pillowtalk', 'pillowtalk', 100, 100),
	spritesheet('temp/shuriken', 'shuriken', 100, 100),

	spritesheet('temp/blankspr', 'blankspr', 100, 100),
];

/* Audios */
const audios: Audio[] = [
	music('title', 'm_main_menu'),
	music('first', 'm_first'),
	sound('place', 'place', 0.5),
	sound('return', 'return', 0.5),
	sound('scroll', 'scroll', 0.5),
	sound('tree/rustle', 't_rustle', 0.5),
	sound('tree/meme_explosion_sound', 'meme_explosion_sound', 0.5),
];

/* Fonts */
await loadFont('DynaPuff-Medium', 'Game Font');

export {
	images,
	spritesheets,
	audios
};