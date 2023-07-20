import { Theme } from '@rbxts/material-ui';
import { Settings } from 'shared/types';

// https://simplynoni.gitbook.io/ranking-panel/setup/panel-configuration
export = {
	Keybind: Enum.KeyCode.Semicolon,
	ChatCommand: '/panel',

	GroupId: 0,
	BotRank: 0,

	RankingPermissions: {
		Users: [],
		Groups: [
			{
				GroupId: 0,
				MinRank: 255,
			},
		],
	},
	ShoutPermissions: {
		Users: [],
		Groups: [
			{
				GroupId: 0,
				MinRank: 255,
			},
		],
	},

	Color: Color3.fromRGB(120, 28, 227),
	Theme: Theme.Dark,

	SoundsEnabled: true,
} satisfies Settings;
