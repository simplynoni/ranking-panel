import { Action } from '@rbxts/rodux';
import { NotificationOptions } from 'shared/types';

export interface ActionAddNotification extends Action<'AddNotification'> {
	notification: NotificationOptions;
}

export interface ActionDeleteNotification extends Action<'DeleteNotification'> {
	notificationId: string;
}
