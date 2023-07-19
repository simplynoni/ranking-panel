import { Dictionary } from '@rbxts/llama';
import { createReducer } from '@rbxts/rodux';
import { NotificationOptions } from 'shared/types';
import { ActionAddNotification, ActionDeleteNotification } from '../actions/notificationActions';

export type NotificationState = Map<string, NotificationOptions>;

const initialState: NotificationState = new Map();

export type NotificationActions = ActionAddNotification | ActionDeleteNotification;

export const notificaitionReducer = createReducer<NotificationState, NotificationActions>(initialState, {
	AddNotification: (state, { notification }) => {
		const copy = Dictionary.copyDeep(state);
		copy.set(notification.Id, notification);
		return copy;
	},
	DeleteNotification: (state, { notificationId }) => {
		const copy = Dictionary.copyDeep(state);
		copy.delete(notificationId);
		return copy;
	},
});
