import { Instant, Linear, SingleMotor } from '@rbxts/flipper';
import Roact from '@rbxts/roact';
import { RouteRendererProps } from '@rbxts/roact-router/typings/Route';
import { Trove } from '@rbxts/trove';

interface RouteState {
	Visible: boolean;
}

export default class RouteBase<Props = {}> extends Roact.Component<RouteRendererProps & Props, RouteState> {
	positionMotor: SingleMotor;
	positionBinding: Roact.Binding<number>;
	fadeMotor: SingleMotor;
	fadeBinding: Roact.Binding<number>;

	constructor(props: RouteRendererProps & Props) {
		super(props);

		this.positionMotor = new SingleMotor(!!this.props.match ? 0.5 : 1);

		const [positionBinding, setPositionBinding] = Roact.createBinding(this.positionMotor.getValue());
		this.positionBinding = positionBinding;

		this.positionMotor.onStep(setPositionBinding);

		this.fadeMotor = new SingleMotor(!!this.props.match ? 0 : 0.25);

		const [fadeBinding, setFadeBinding] = Roact.createBinding(this.fadeMotor.getValue());
		this.fadeBinding = fadeBinding;

		this.fadeMotor.onStep(setFadeBinding);

		this.setState({
			Visible: !!this.props.match,
		});
	}

	public render(): Roact.Element | undefined {
		return;
	}

	private setClosed(closed: boolean) {
		const trove = new Trove();

		if (closed === false) {
			// OPEN
			this.setState({
				Visible: true,
			});

			this.positionMotor.setGoal(new Linear(0.5, { velocity: 2.5 }));
			this.fadeMotor.setGoal(new Instant(0));
		} else {
			// CLOSED
			this.positionMotor.setGoal(new Linear(-0.25, { velocity: 3.5 }));
			this.fadeMotor.setGoal(new Linear(0.75, { velocity: 3.5 }));

			const onComplete = this.positionMotor.onComplete(() => {
				if (!this.props.match) {
					this.setState({
						Visible: false,
					});
					this.positionMotor.setGoal(new Instant(1));
				}

				trove.clean();
			});

			trove.add(() => onComplete.disconnect());
		}
	}

	protected didUpdate(previousProps: RouteRendererProps): void {
		if (this.props.match !== previousProps.match) {
			this.setClosed(!this.props.match);
		}
	}
}
