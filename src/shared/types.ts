import { Theme } from '@rbxts/material-ui';

export interface Settings {
	GroupId: number;

	Color: Color3;
	Theme: Theme;

	RemoveCredit: boolean;
}

export enum PromptType {
	Rank,
	User,
	Text,
}

export interface PromptArg {
	Name: string;
	Type: PromptType;
	Value: unknown;
	OnChanged: (value: unknown) => void;
}

// export interface Action {
// 	Name: string;
// 	Description: string;
// 	Args: ActionArg[];
// }
