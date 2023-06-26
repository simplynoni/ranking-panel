import { Scheme, Theme, ThemeState, UIBase } from '@rbxts/material-ui';
import Roact from '@rbxts/roact';

const scheme = Scheme.light(Color3.fromRGB(120, 28, 227)).Colors;
const tempTheme: ThemeState = {
	Color: Color3.fromRGB(120, 28, 227),
	Scheme: scheme,
	Theme: Theme.Light,
};

export default class MainUI extends Roact.Component {
	public render(): Roact.Element | undefined {
		return (
			<UIBase
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.425, 0.5)}
				AspectRatio={1.869}
				AspectType={Enum.AspectType.ScaleWithParentSize}
				MaxSize={new Vector2(1000)}
				MinSize={new Vector2(500)}
				Theme={tempTheme}
			></UIBase>
		);
	}
}
