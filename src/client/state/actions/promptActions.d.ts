import { Action } from '@rbxts/rodux';
import { PromptArg } from 'shared/types';

export interface ActionSetPromptVisible extends Action<'SetPromptVisible'> {
	promptVisible: boolean;
}

export interface ActionSetPromptName extends Action<'SetPromptName'> {
	promptName: string;
}

export interface ActionSetPromptArgs extends Action<'SetPromptArgs'> {
	promptArgs: PromptArg[];
}

export interface ActionSetPromptOnSubmitted extends Action<'SetPromptOnSubmitted'> {
	promptOnSubmitted: () => void;
}
