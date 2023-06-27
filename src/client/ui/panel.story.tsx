import { Scheme, Theme, ThemeState } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';
import MainUI from '.';

// for use with hoarcekat (https://github.com/Kampfkarren/hoarcekat)
export = function (frame: GuiObject) {
	const scheme = Scheme.dark(Color3.fromRGB(255, 0, 0)).Colors;
	const theme: ThemeState = {
		Color: Color3.fromRGB(120, 28, 227),
		Scheme: scheme,
		Theme: Theme.Light,
	};
	const component = <MainUI GroupName='Group Name' Theme={theme} />;

	const tree = Roact.mount(component, frame);

	return () => {
		Roact.unmount(tree);
	};
};
