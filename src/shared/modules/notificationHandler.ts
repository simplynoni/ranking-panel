import { NotificationType } from 'shared/types';
import { PanelEvents } from '../network';

export default class NotificationHandler {
	constructor(private readonly Player: Player) {}

	Error(text: string) {
		print(text);
		return PanelEvents.server.NewNotifcation(this.Player, NotificationType.Error, text);
	}

	Success(text: string) {
		return PanelEvents.server.NewNotifcation(this.Player, NotificationType.Success, text);
	}
}
