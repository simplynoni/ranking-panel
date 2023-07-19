import { Store, combineReducers } from '@rbxts/rodux';
import { NotificationActions, NotificationState, notificaitionReducer } from './reducers/notificationReducer';
import { PanelActions, PanelState, panelReducer } from './reducers/panelReducer';
import { PromptActions, PromptState, promptReducer } from './reducers/promptReducer';

export interface ClientState {
	promptState: PromptState;
	panelState: PanelState;
	notificationState: NotificationState;
}

export type ClientActions = PromptActions | PanelActions | NotificationActions;

export const storeReducer = combineReducers<ClientState, ClientActions>({
	promptState: promptReducer,
	panelState: panelReducer,
	notificationState: notificaitionReducer,
});

export const clientStore = new Store(storeReducer);
