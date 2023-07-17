import { Store, combineReducers } from '@rbxts/rodux';
import { PromptActions, PromptState, promptReducer } from './reducers/promptReducer';

export interface PanelState {
	promptState: PromptState;
}

export type PanelActions = PromptActions;

export const storeReducer = combineReducers<PanelState, PanelActions>({
	promptState: promptReducer,
});

export const panelStore = new Store(storeReducer);
