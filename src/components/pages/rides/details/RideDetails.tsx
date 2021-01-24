import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { getRideDistance, Ride, Stop } from "../../../../types";
import { makeRide } from "../../../../types/__test__/helpers";
import { Page, Property, Section } from "../../../common";

type RideDetailsParams = { rideId: string };

type RideDetailsProps = RouteComponentProps<RideDetailsParams>;

interface IStopSectionProps {
	title: string;
	divider?: boolean;
	stop: Stop;
}

function StopSection(props: IStopSectionProps) {
	const divider = () => props.divider === undefined ? false : props.divider;
	const location = () => props.stop.location.name; 
	const date = () => props.stop.moment.toLocaleDateString(); 
	const time = () => props.stop.moment.toLocaleTimeString(); 
	return <Section title={props.title} divider={divider()}>
		<Property label="Location" value={location()} />
		<Property label="Date" value={date()}/>
		<Property label="Time" value={time()}/>
	</Section>;
}

const RideDetails: React.FC<RideDetailsProps> = ({ match }: RideDetailsProps) => {

	const ride = makeRide({arrival: undefined});

	const showArrival = (): boolean => ride.arrival !== undefined;

	const getDistanceString = (ride: Ride): string => {
		let distance: number;
		try {
			distance = getRideDistance(ride);
		} catch (error) {
			distance = 0;
		}
		return distance.toString();
	}

	return <Page title={`Ride ${match.params.rideId!!}`}>
		{/* <p>Showing details for the ride with id of {match.params.rideId!!}</p> */}
		<Section title="Overview" divider>
			<Property label="Distance" value={getDistanceString(ride)}/>
			<Property label="Duration" />
			<Property label="Traffic" />
			<Property label="Comment" />
		</Section>
		<StopSection title="Departure" divider stop={ride.departure}/>
		{ showArrival() && <StopSection title="Arrival" stop={ride.arrival!!}/>}
		
	</Page>
};

export default withRouter(RideDetails);