import { Dictionary } from '@rbxts/llama';
import { createReducer } from '@rbxts/rodux';
import { PromptArg } from 'shared/types';
import { ActionSetPromptArgs, ActionSetPromptVisible } from '../actions/promptActions';

export interface PromptState {
	promptVisible: boolean;
	promptArgs: PromptArg[];
}

const initialState: PromptState = {
	promptVisible: false,
	promptArgs: [],
};

export type PromptActions = ActionSetPromptVisible | ActionSetPromptArgs;

export const promptReducer = createReducer<PromptState, PromptActions>(initialState, {
	SetPromptVisible: (state, { promptVisible }) => {
		return Dictionary.merge(state, { promptVisible });
	},
	SetPromptArgs: (state, { promptArgs }) => {
		return Dictionary.merge(state, { promptArgs });
	},
});
