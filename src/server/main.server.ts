import { Players } from '@rbxts/services';
import ActionHandler from './actionHandler';
import config from './config';
import { Events } from './network';

const ActionHandlers = new Map<Player, ActionHandler>();

Players.PlayerAdded.Connect((player) => {
	const actionHandler = new ActionHandler(player);
	ActionHandlers.set(player, actionHandler);

	if (actionHandler.HasPanelPermission()) {
		Events.InitializePanel.fire(player, config, actionHandler.GetUsableClientActions());
	}
});

Players.PlayerRemoving.Connect((player) => {
	const actionHandler = ActionHandlers.get(player);
	if (actionHandler) {
		actionHandler.Destroy();
		ActionHandlers.delete(player);
	}
});

Events.RunAction.connect((player, action, args) => {
	const actionHandler = ActionHandlers.get(player);

	if (actionHandler) {
		actionHandler.RunAction(action, args);
	}
});
