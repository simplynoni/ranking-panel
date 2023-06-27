import { Theme } from '@rbxts/material-ui';
import { Players } from '@rbxts/services';
import { Settings } from 'shared/types';
import { Events } from './network';

const tempSettings: Settings = {
	GroupId: 5641002,

	Color: Color3.fromRGB(120, 28, 227),
	Theme: Theme.Dark,

	RemoveCredit: false,
};

Players.PlayerAdded.Connect((player) => {
	// todo: permissions
	Events.InitializePanel.fire(player, tempSettings);
});
