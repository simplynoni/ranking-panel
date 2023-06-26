import Roact from '@rbxts/roact';
import { Players } from '@rbxts/services';
import MainUI from './ui/main';

const playerGui = Players.LocalPlayer.WaitForChild('PlayerGui') as PlayerGui;

Roact.mount(
	<screengui ResetOnSpawn={false} IgnoreGuiInset>
		<MainUI />
	</screengui>,
	playerGui,
	'RankingPanel',
);
