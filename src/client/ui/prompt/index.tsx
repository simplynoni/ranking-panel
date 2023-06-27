import { OutlinedButton, ThemeState, TonalButton, Topbar, UIBase } from '@rbxts/material-ui';
import { Gotham } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import UserPage from './user';

interface PromptProps {
	Theme: ThemeState;
}

export default class Prompt extends Roact.Component<PromptProps> {
	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;

		return (
			<UIBase
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(0.6, 0.65)}
				Theme={theme}
			>
				<uilistlayout SortOrder='LayoutOrder' />
				<Topbar
					Title={`Rank <font color="#${theme.Scheme.onSurfaceVariant.ToHex()}" face="GothamMedium">> User</font>`}
					Height={new UDim(0.2)}
					TextAlignment={Enum.TextXAlignment.Left}
					RichText
					Theme={theme}
					CloseFunction={() => {
						print('close');
					}}
				/>
				<frame Key='Content' Size={UDim2.fromScale(1, 0.6)} BackgroundTransparency={1}>
					{/* Pages here */}
					<UserPage Theme={theme} />
				</frame>
				<frame Key='Footer' Size={UDim2.fromScale(1, 0.2)} BackgroundTransparency={1}>
					<frame
						Key='Divider'
						Size={new UDim2(1, 0, 0, 1)}
						BorderSizePixel={0}
						BackgroundColor3={theme.Scheme.outline}
					/>
					{/* <IconButton
						AnchorPoint={new Vector2(0, 0.5)}
						Position={new UDim2(0, 12, 0.5, 0)}
						Size={new UDim2(0, 0, 1, -10)}
						Icon={Icons.BackArrow}
						Theme={theme}
						Pressed={() => {}}
					/> */}
					<OutlinedButton
						AnchorPoint={new Vector2(0, 0.5)}
						Position={new UDim2(0, 12, 0.5, 0)}
						Size={new UDim2(0, 0, 1, -10)}
						Text='Back'
						AutomaticSize
						Theme={theme}
						Pressed={() => {}}
						Disabled
					/>
					<textlabel
						Key='PromptCount'
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={UDim2.fromScale(0.5, 0.5)}
						Size={new UDim2(0.5, 0, 1, -10)}
						BackgroundTransparency={1}
						Text={`Prompt <font color="#${theme.Scheme.onSurface.ToHex()}" face="GothamMedium">1</font> of 2`} // todo
						TextColor3={theme.Scheme.onSurfaceVariant}
						FontFace={Gotham}
						RichText
						TextScaled
					>
						<uipadding PaddingBottom={new UDim(0, 6)} PaddingTop={new UDim(0, 6)} />
					</textlabel>
					<TonalButton
						AnchorPoint={new Vector2(1, 0.5)}
						Position={new UDim2(1, -12, 0.5, 0)}
						Size={new UDim2(0, 0, 1, -10)}
						Text='Next'
						AutomaticSize
						Theme={theme}
						Pressed={() => {}}
					/>
				</frame>
			</UIBase>
		);
	}
}
