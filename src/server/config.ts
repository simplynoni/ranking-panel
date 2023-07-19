import { Theme } from '@rbxts/material-ui';
import { Settings } from 'shared/types';

export = {
	Keybind: Enum.KeyCode.Semicolon,
	ChatCommand: '/panel',

	GroupId: 5641002,
	BotRank: 20,

	RankingPermissions: {
		Users: [114336888],
		Groups: [
			{
				GroupId: 0,
				MinRank: 255,
			},
		],
	},
	ShoutPermissions: {
		Users: [114336888],
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
	RemoveCredit: false,
} satisfies Settings;
