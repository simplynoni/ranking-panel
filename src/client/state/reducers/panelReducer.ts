import { Dictionary } from '@rbxts/llama';
import { createReducer } from '@rbxts/rodux';
import { ActionSetPanelVisible } from '../actions/panelActions';

export interface PanelState {
	panelVisible: boolean;
}

const initialState: PanelState = {
	panelVisible: false,
};

export type PanelActions = ActionSetPanelVisible;

export const panelReducer = createReducer<PanelState, PanelActions>(initialState, {
	SetPanelVisible: (state, { panelVisible }) => {
		return Dictionary.merge(state, { panelVisible });
	},
});
