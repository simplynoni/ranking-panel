import { Flamework } from '@flamework/core';
import { Chat, Players, TextChatService } from '@rbxts/services';
import { Settings } from 'shared/types';
import NotificationHandler from '../shared/modules/notificationHandler';
import ActionHandler from './actionHandler';
import config from './config';
import { Events } from './network';

const configTypeCheck = Flamework.createGuard<Settings>();
if (!configTypeCheck(config)) {
	throw "RankingPanel | Config failed typecheck! Make sure you didn't delete anything, or add invalid values.";
}

const ActionHandlers = new Map<Player, ActionHandler>();

Players.PlayerAdded.Connect((player) => {
	const notificationHandler = new NotificationHandler(player);
	const actionHandler = new ActionHandler(player, notificationHandler);
	ActionHandlers.set(player, actionHandler);

	if (actionHandler.HasPanelPermission()) {
		Events.InitializePanel(player, config, actionHandler.GetUsableClientActions());
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

if (config.ChatCommand) {
	// Legacy Chat
	Chat.RegisterChatCallback(
		'OnServerReceivingMessage',
		(message: { ShouldDeliver: boolean; Message: string; SpeakerUserId: number }) => {
			const player = Players.GetPlayerByUserId(message.SpeakerUserId);
			if (player && message.Message === config.ChatCommand) {
				message.ShouldDeliver = false;
				Events.ShowPanel(player);
			}
			return message;
		},
	);

	// New Chat
	const command = new Instance('TextChatCommand');
	command.Name = 'OpenRankingPanel';
	command.Enabled = true;
	command.PrimaryAlias = config.ChatCommand;
	command.Parent = TextChatService;
	command.Triggered.Connect((source) => {
		const player = Players.GetPlayerByUserId(source.UserId);
		if (player) {
			Events.ShowPanel(player);
		}
	});
}
