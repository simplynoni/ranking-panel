import { Networking } from '@flamework/networking';
import { ClientAction, Settings } from './types';

interface ServerEvents {
	RunAction(Action: string, Args: Map<string, unknown>): void;
}

interface ClientEvents {
	InitializePanel(Settings: Settings, Actions: ClientAction[]): void;
	ShowPanel(): void;
}

interface ServerFunctions {}

interface ClientFunctions {}

export const PanelEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const PanelFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
