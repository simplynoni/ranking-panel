import { Networking } from '@flamework/networking';
import { Settings } from './types';

interface ServerEvents {}

interface ClientEvents {
	InitializePanel(Settings: Settings): void;
}

interface ServerFunctions {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
