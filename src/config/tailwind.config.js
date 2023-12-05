const plugin = require('tailwindcss/plugin');
const { screenHeight, screenWidth } = require('../constants/styleConstants');

// update DesignSystemTypes.ts file after any update to keep types in sync
const themeColors = {
	black: '#000000',
	lightGreyOpacity: '#0000001A',
	white: '#fff',
	pink: '#00ff00',
	lightBlue: '#48A7FF',
	secondary: '#FFAA00',
	primary: '#D7D7D8',
	success: '#28C88E',
	disabled: '#8A8A8F',
	surface: '#131319',
	error: '#FC3361',
	transparent: 'transparent',
	yellow: '#FFCD0A',
	red: '#FF0F46',
	darkPurple: '#03000C',
	purple: '#8F40E9',
	lightText: '#212121',
	green: '#08ACB7',
};

module.exports = {
	theme: {
		colors: {
			...themeColors,
		},
		textColor: {
			...themeColors,
		},
		fontFamily: {
			roboto: ['Roboto'],
			primaryBold: ['Nunito-Bold'],
		},
		fontSize: {
			vxs: '6px',
			xxxs: '8px',
			nine: '9px',
			xxs: '10px',
			xs: '11px',
			sm: '13px',
			base: '15px',
			lg: '16px',
			xl: '20px',
			'2xl': '24px',
			'3xl': '32px',
			'6xl': '48px',
		},
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({
				'center-h': 'justify-center items-center flex-row',
				'center-v': 'justify-center items-center flex-col',
				'between-h': 'justify-between items-center flex-row',
				'between-v': 'justify-between items-center flex-col',
				'resize-repeat': {
					resizeMode: `repeat`,
				},
				font: 'text-primary',
				captionLight: 'font text-xs font-primary',
				captionRegular: 'font text-sm font-primary',
				overline: 'font text-xxs font-primary',
				overlineBold: 'font text-xxs font-primaryBold',
				overlineSemiBold: 'font text-xxs font-primarySemiBold',
				caption: 'font text-xs font-primarySemiBold',
				captionBold: 'font text-xs font-primaryBold',
				caption2Light: 'font text-xss font-primary',
				caption2: 'font text-xss font-primarySemiBold',
				caption2Bold: 'font text-xss font-primaryBold',
				subHeadBold: 'font text-sm font-primaryBold',
				subHeadSemiBold: 'font text-sm font-primarySemiBold',
				subHead: 'font text-sm font-primary',
				body2Bold: 'font text-base font-primaryBold',
				body2light: 'font text-base font-primary',
				body2: 'font text-base font-primarySemiBold',
				body1: 'font text-lg font-primaryBold',
				title: 'font text-xl font-primaryBold',
				titleBold: 'font text-lg font-primaryBold',
				heading: 'font text-2xl font-primaryBold',
				'w-full': `w-[${screenWidth}px]`,
				'h-full': `h-[${screenHeight}px]`,
			});
		}),
	],
};
