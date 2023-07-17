import { OutlinedButton, ThemeState, TonalButton, Topbar, UIBase } from '@rbxts/material-ui';
import { Gotham } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { Route, RouterContext } from '@rbxts/roact-router';
import { panelStore } from 'client/state';
import RankPage from './rankPrompt';
import UserPage from './userPrompt';

interface PromptProps {
	Theme: ThemeState;
	GroupId: number;
	Visible: boolean;
}

export default class Prompt extends Roact.Component<PromptProps> {
	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;

		return (
			<RouterContext.Consumer
				render={(router) => {
					if (router.location.path !== '/rank') {
						router.history.push('/user');
						router.history.push('/rank');
					}
					return (
						<UIBase
							AnchorPoint={new Vector2(0.5, 0.5)}
							Position={UDim2.fromScale(0.5, 0.5)}
							Size={UDim2.fromScale(0.6, 0.65)}
							Theme={theme}
							Closed={!this.props.Visible}
						>
							<uilistlayout SortOrder='LayoutOrder' />
							<Topbar
								Title={`Rank <font color="#${theme.Scheme.onSurfaceVariant.ToHex()}" face="GothamMedium">> Rank</font>`}
								Height={new UDim(0.2)}
								TextAlignment={Enum.TextXAlignment.Left}
								RichText
								Theme={theme}
								CloseFunction={() => {
									panelStore.dispatch({ type: 'SetPromptVisible', promptVisible: false });
								}}
							/>
							<frame Key='Content' Size={UDim2.fromScale(1, 0.6)} BackgroundTransparency={1}>
								{/* Pages here */}
								<Route
									path='/user'
									exact
									alwaysRender
									render={(router) => <UserPage Theme={theme} {...router} />}
								/>
								<Route
									path='/rank'
									exact
									alwaysRender
									render={(router) => (
										<RankPage GroupId={this.props.GroupId} Theme={theme} {...router} />
									)}
								/>
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
				}}
			/>
		);
	}
}
