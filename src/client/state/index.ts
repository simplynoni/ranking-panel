import { Store, combineReducers } from '@rbxts/rodux';
import { PanelActions, PanelState, panelReducer } from './reducers/panelReducer';
import { PromptActions, PromptState, promptReducer } from './reducers/promptReducer';

export interface ClientState {
	promptState: PromptState;
	panelState: PanelState;
}

export type ClientActions = PromptActions | PanelActions;

export const storeReducer = combineReducers<ClientState, ClientActions>({
	promptState: promptReducer,
	panelState: panelReducer,
});

export const clientStore = new Store(storeReducer);
