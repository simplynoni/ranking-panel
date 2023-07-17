import { Action } from '@rbxts/rodux';
import { PromptArg } from 'shared/types';

export interface ActionSetPromptVisible extends Action<'SetPromptVisible'> {
	promptVisible: boolean;
}

export interface ActionSetPromptArgs extends Action<'SetPromptArgs'> {
	promptArgs: PromptArg[];
}
