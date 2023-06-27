import { Theme } from '@rbxts/material-ui';

export interface Settings {
	GroupId: number;

	Color: Color3;
	Theme: Theme;

	RemoveCredit: boolean;
}

export interface ActionArg {
	Name: string;
	Type: 'User' | 'Rank' | 'String';
}

export interface Action {
	Name: string;
	Description: string;
	Args: ActionArg[];
}
