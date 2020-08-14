import React, { } from "react";
import { Container, createStyles, makeStyles, Theme, Fab } from "@material-ui/core";
import { Ride } from "../../../types";
import { TrafficCondition } from "../form/fields";

import AddIcon from '@material-ui/icons/Add';
import RideList from "./RideList";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import RideForm from "../form/RideForm";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			marginTop: 10,
			overflow: "auto"
		},
		fab: {
			position: 'fixed',
			bottom: theme.spacing(2),
			right: theme.spacing(2),
		},
	})
);

const model: Ride = {
	departure: {
		moment: new Date(),
		location: {
			id: 3,
			name: "Magasin",
			latitude: 23.45,
			longitude: 23.45
		},
		odometerValue: 10000
	},
	arrival: {
		moment: new Date(),
		location: {
			id: 4,
			name: "Maison",
			latitude: 25,
			longitude: 26
		},
		odometerValue: 12000
	},
	driverPseudonym: undefined,
	trafficCondition: TrafficCondition.NORMAL,
	comment: "Je suis un brave."
};

const rides: Ride[] = [0, 1, 2, 3, 4, 5, 6].map(e => {
	model.id = e;
	return { ...model };
});

export type RideScreenContentKey = "form" | "list" | "details";

interface IRidesProps {
	onAddActionClicked: () => void;
}

/**
 * The component acts as the entry point of the rides entry. It allows a user
 * to visualize rides, add a new ride, edit and consult a specific ride.
 */
function Rides(props: IRidesProps) {

	const classes = useStyles();
	const history = useHistory();
	const { path } = useRouteMatch();

	const showDetails = (rideId: number) => {
		history.push(`${path}/${rideId}`)
	}

	return (
		<Container>
			<RideList rides={rides} onShowDetails={(rideId: number) => showDetails(rideId)} />
			<Fab
				color="primary"
				aria-label="add"
				className={classes.fab}
				onClick={() => {
					history.push(`${path}/form`);
					props.onAddActionClicked();
				}}
			>
				<AddIcon />
			</Fab>
			<Switch>
				<Route path={`${path}/:rideId`} children={<p>details</p>} />
				<Route path={`${path}/form`}>
					<RideForm
						ride={model}
						isDriving={false}
						onChange={() => { }}
						onSubmit={() => { }}
					/>
				</Route>
			</Switch>
		</Container>
	);
}

export default Rides;