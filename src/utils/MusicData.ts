const overlap = 2;

const Data = {
	m_main_menu: {
		offset: 1 / (170 / 60),
		bpm: 170,
	},
	m_salonbase: {
		offset: 0,
		bpm: 137,
		loop: true,
		start: 0 + overlap,
		end: 2690801 / 48000 + overlap,
	},
	m_saloncutscene: {
		offset: 0,
		bpm: 137,
		loop: true,
		start: 0 + overlap,
		end: 2690801 / 48000 + overlap,
	},
	m_salondowntime: {
		offset: 0,
		bpm: 137,
		loop: true,
		start: 0 + overlap,
		end: 2690801 / 48000 + overlap,
		notes: [
			[28.02,29.41], [29.78,30.36], [30.65,31.23], [31.53,32.91],
			[33.28,33.46], [33.57,33.68], [33.72,33.83], [34.01,34.51],
			[34.59,34.82], [35.03,36.05], [36.78,37.44], [37.59,38.39],
			[38.54,38.68], [38.83,39.99], [40.29,40.82], [40.99,41.52],
			[41.64,41.75], [42.04,44.22], [44.67,45.39], [45.54,46.78],
			[47.29,48.82], [49.05,49.16], [49.48,49.60], [51.46,51.55],
			[51.89,52.01], [52.33,52.45], [52.62,54.08]
		],
	},
	m_first: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_draw: {
		offset: 0,
		bpm: 140,
		loop: true,
		start: 0 + overlap,
		end: 760286 / 48000 + overlap,
	},
	m_first_end: {
		offset: 0,
		bpm: 0,
		loop: false,
	},
	m_shop: {
		offset: 41860 / 48000,
		bpm: 86,
		loop: true,
		start: 41860 / 48000 + overlap,
		end: 2854884 / 48000 + overlap,
	},
};

export type MusicKey = keyof typeof Data;
export type MusicDataType = {
	[K in MusicKey]: {
		offset: number;
		bpm: number;
		loop: boolean;
		start: number;
		end: number;
		notes: [number, number][];
	};
};

export default Data as MusicDataType;
