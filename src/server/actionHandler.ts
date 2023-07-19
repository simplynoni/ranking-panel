import { Flamework } from '@flamework/core';
import { Action, ClientAction } from 'shared/types';
import NotificationHandler from '../shared/modules/notificationHandler';

const actionTypeCheck = Flamework.createGuard<Action>();

export default class ActionHandler {
	private Actions = new Map<string, Action>();

	constructor(private readonly Player: Player, private readonly NotificationHandler: NotificationHandler) {
		const actions = script.Parent?.FindFirstChild('actions');

		if (actions) {
			for (const [_, module] of pairs(actions.GetChildren())) {
				if (!module.IsA('ModuleScript')) continue;
				const action = require(module);
				if (!actionTypeCheck(action)) {
					warn(
						`RankingPanel | Action '${module.Name}' failed typecheck! Make sure you didn't edit anything that would cause it to break.`,
					);
					continue;
				}

				let hasPermission = false;
				if (action.Permissions.Users.includes(Player.UserId)) {
					hasPermission = true;
				} else {
					for (const [_, group] of pairs(action.Permissions.Groups)) {
						if (Player.GetRankInGroup(group.GroupId) >= group.MinRank) {
							hasPermission = true;
							break;
						}
					}
				}
				if (hasPermission) {
					this.Actions.set(action.Name, action);
				}
			}
		}
	}

	HasPanelPermission() {
		return this.Actions.size() > 0;
	}

	GetUsableClientActions() {
		const clientActions: ClientAction[] = [];
		for (const [name, action] of pairs(this.Actions)) {
			const clientAction = {
				Name: action.Name,
				Description: action.Description,
				Args: action.Args,
			} satisfies ClientAction;
			clientActions.push(clientAction);
		}
		return clientActions;
	}

	RunAction(actionName: string, args: Map<string, unknown>) {
		const action = this.Actions.get(actionName);
		if (action) {
			action.Run(this.Player, this.NotificationHandler, args);
		}
	}

	Destroy() {
		this.Actions.clear();
	}
}
