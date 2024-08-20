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
	};
};

export default Data as MusicDataType;
