import { Players } from '@rbxts/services';
import ActionHandler from './actionHandler';
import config from './config';
import { Events } from './network';

Players.PlayerAdded.Connect((player) => {
	const actionHandler = new ActionHandler(player);

	if (actionHandler.HasPanelPermission()) {
		Events.InitializePanel.fire(player, config, actionHandler.GetUsableClientActions());
	}
});
