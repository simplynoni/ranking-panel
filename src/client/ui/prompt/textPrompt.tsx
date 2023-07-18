import { ThemeState } from '@rbxts/material-ui';
import { Gotham, GothamBold } from '@rbxts/material-ui/out/Fonts';
import Roact from '@rbxts/roact';
import { TextService } from '@rbxts/services';
import RouteBase from './pageBase';

interface SearchResults {
	Name: string;
	Rank: number;
}

interface PageProps {
	PositionBinding: Roact.Binding<number>;
	FadeBinding: Roact.Binding<number>;
	Visible: boolean;
	PageVisible: boolean;
	PromptContainerVisible: boolean;
	Name: string;
	Theme: ThemeState;
	OnChanged?: (text: string) => void;
}

interface PageState {
	Text: string;
	TextHeight: number;
	ScrollPosition: number;
}

class TextPageBase extends Roact.Component<PageProps, PageState> {
	CurrentThread?: thread;

	constructor(props: PageProps) {
		super(props);

		this.setState({
			Text: '',
			TextHeight: 16,
			ScrollPosition: 0,
		});
	}

	public render(): Roact.Element | undefined {
		const theme = this.props.Theme;

		return (
			<canvasgroup
				Key={'TextPage'}
				GroupTransparency={this.props.FadeBinding.map((fade) => fade)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={this.props.PositionBinding.map((x) => {
					return UDim2.fromScale(x, 0.5);
				})}
				BackgroundTransparency={1}
				Size={UDim2.fromScale(1, 1)}
				Visible={this.props.PageVisible}
				ZIndex={this.props.Visible ? 2 : 1}
			>
				<scrollingframe
					Size={new UDim2(1, -2, 0.85, 0)}
					LayoutOrder={2}
					BackgroundTransparency={1}
					BorderSizePixel={0}
					ScrollBarImageColor3={theme.Scheme.outline}
					ScrollBarThickness={this.props.Visible ? 3 : 0}
					CanvasSize={UDim2.fromOffset(0, this.state.TextHeight)}
					CanvasPosition={new Vector2(0, this.state.ScrollPosition)}
					Change={{
						CanvasSize: (frame) => {
							this.setState({
								ScrollPosition: frame.AbsoluteCanvasSize.Y - frame.AbsoluteSize.Y,
							});
						},
					}}
				>
					<textbox
						Size={UDim2.fromScale(1, 1)}
						BackgroundTransparency={1}
						Text={this.state.Text}
						PlaceholderText={this.props.Name}
						TextColor3={theme.Scheme.onBackground}
						PlaceholderColor3={theme.Scheme.onSurfaceVariant}
						FontFace={Gotham}
						TextSize={16}
						TextXAlignment='Left'
						TextYAlignment='Top'
						ClearTextOnFocus={false}
						TextWrapped
                        MultiLine
						Change={{
							Text: (textBox) => {
								const text = textBox.Text.sub(1, 255);
								const bounds = TextService.GetTextSize(
									text,
									16,
									Enum.Font.Gotham,
									new Vector2(textBox.AbsoluteSize.X - 24, math.huge),
								);
								textBox.Text = text;
								this.setState({
									Text: text,
									TextHeight: bounds.Y + 10,
								});
								if (this.props.OnChanged) {
									this.props.OnChanged(text);
								}
							},
						}}
					>
						<uipadding
							PaddingBottom={new UDim(0, 5)}
							PaddingLeft={new UDim(0, 12)}
							PaddingRight={new UDim(0, 12)}
							PaddingTop={new UDim(0, 5)}
						/>
					</textbox>
				</scrollingframe>
				<textlabel
					Key='Counter'
					Position={UDim2.fromScale(0, 0.85)}
					Size={UDim2.fromScale(1, 0.15)}
					BackgroundTransparency={1}
					Text={`${this.state.Text.size()}/255`}
					TextColor3={this.state.Text.size() >= 255 ? theme.Scheme.primary : theme.Scheme.onSurfaceVariant}
					FontFace={this.state.Text.size() >= 255 ? GothamBold : Gotham}
					TextXAlignment='Left'
					TextScaled
				>
					<uipadding
						PaddingBottom={new UDim(0, 2)}
						PaddingLeft={new UDim(0, 12)}
						PaddingRight={new UDim(0, 12)}
						PaddingTop={new UDim(0, 2)}
					/>
				</textlabel>
			</canvasgroup>
		);
	}

	protected didUpdate(previousProps: PageProps, previousState: PageState): void {
		if (
			previousProps.PromptContainerVisible !== this.props.PromptContainerVisible &&
			this.props.PromptContainerVisible
		) {
			this.setState({
				Text: '',
			});
		}
	}
}

export default class TextPage extends RouteBase<{
	Theme: ThemeState;
	PromptContainerVisible: boolean;
	Name: string;
	OnChanged?: (text: string) => void;
}> {
	render() {
		return (
			<TextPageBase
				PageVisible={this.state.PageVisible}
				PositionBinding={this.positionBinding}
				FadeBinding={this.fadeBinding}
				{...this.props}
			/>
		);
	}
}
