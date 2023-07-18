import { Dictionary } from '@rbxts/llama';
import { createReducer } from '@rbxts/rodux';
import { PromptArg } from 'shared/types';
import { ActionSetPromptArgs, ActionSetPromptName, ActionSetPromptVisible } from '../actions/promptActions';

export interface PromptState {
	promptVisible: boolean;
	promptName: string;
	promptArgs: PromptArg[];
	promptOnSubmitted: () => void;
}

const initialState: PromptState = {
	promptVisible: false,
	promptName: '',
	promptArgs: [],
	promptOnSubmitted: () => {},
};

export type PromptActions = ActionSetPromptVisible | ActionSetPromptName | ActionSetPromptArgs;

export const promptReducer = createReducer<PromptState, PromptActions>(initialState, {
	SetPromptVisible: (state, { promptVisible }) => {
		return Dictionary.merge(state, { promptVisible });
	},
	SetPromptName: (state, { promptName }) => {
		return Dictionary.merge(state, { promptName });
	},
	SetPromptArgs: (state, { promptArgs }) => {
		return Dictionary.merge(state, { promptArgs });
	},
});
