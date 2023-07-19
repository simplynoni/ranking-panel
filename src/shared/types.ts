import { ContainerScheme, CustomColorGroup, Theme } from '@rbxts/material-ui';
import NotificationHandler from 'shared/modules/notificationHandler';

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

	SoundsEnabled: boolean;
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
	Run: (player: Player, notificationHandler: NotificationHandler, args: Map<string, unknown>) => void;
}

export type ClientAction = Omit<Action, 'Run' | 'Permissions'>;

export enum NotificationType {
	Error,
	Success,
}

export interface NotificationOptions {
	Id: string;
	Content: string;
	Duration: number;
	OnPressed?: () => void;
	Title?: string;
	TitleColor?: Color3;
	ColorScheme?: ContainerScheme | 'Surface';
	CustomColorGroup?: CustomColorGroup['Colors'];
}
