import { Theme } from '@rbxts/material-ui';

export interface Permissions {
	Users: number[];
	Groups: { GroupId: number; MinRank: number }[];
}

export interface Settings {
	Keybind: Enum.KeyCode;
	ChatCommand: string;

	GroupId: number;
	BotRank: number;

	RankingPermissions: Permissions;
	ShoutPermissions: Permissions;

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
}

export interface Action {
	Name: string;
	Description: string;
	Args: PromptArg[];
	Permissions: Permissions;
	Run: (player: Player, args: Map<string, unknown>) => void;
}

export type ClientAction = Omit<Action, 'Run' | 'Permissions'>;
