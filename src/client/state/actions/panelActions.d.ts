import { Action } from '@rbxts/rodux';

export interface ActionSetPanelVisible extends Action<'SetPanelVisible'> {
	panelVisible: boolean;
}
