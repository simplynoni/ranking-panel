import { Theme } from '@rbxts/material-ui';

export interface Settings {
	GroupId: number;

	Color: Color3;
	Theme: Theme;

	RemoveCredit: boolean;
}

export interface CommandArg {
	Name: string;
	Type: 'User' | 'Rank' | 'String';
}

export interface Command {
	Name: string;
	Description: string;
	Args: CommandArg[];
}
