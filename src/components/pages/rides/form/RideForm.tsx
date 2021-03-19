import React, { useEffect, useState } from 'react';
import { Button, Typography, Divider } from '@material-ui/core';

import { CommentField, TrafficConditionField, TrafficCondition } from './fields';
import { isValidRide, Ride, Stop, validateRide } from '../../../../types';
import StopForm from './StopForm';

import "./RideForm.scss";
import { RideData } from '../../../../services/RideService';
import StopService from '../../../../services/StopService';

interface IRideFormProps {
    /**
     * Is the form ride.
     */
    ride?: Ride;
    /**
     * if set to true then the form shows arrival and retrospective ones.
     */
    isDriving: boolean;
    /**
     * Called when the form values are changed.
     *
     * @param data is the updated data.
     */
    onChange: (data: Ride) => void;
    /**
     * Called when the submit button is clicked. data contain the data
     * submitted by the user.
     */
    onSubmit: (data: RideData) => void;

    onError?: (error: Error) => void;
}

const makeRide = (dep: Stop, arr: Stop, tc: TrafficCondition, com: string | undefined) => ({
    departure: dep,
    arrival: arr,
    trafficCondition: tc,
    comment: com,
    driverPseudonym: undefined
});

const RideForm = (props: IRideFormProps) => {

    const getDefaultDeparture = () => props.ride ? props.ride.departure : undefined;
    const getDefaultArrival = () => props.ride && props.ride.arrival ? props.ride.arrival : undefined;
    const getDefaultTrafficCondition = () => props.ride ? props.ride.trafficCondition : TrafficCondition.CALM;
    const getDefaultComment = () => props.ride ? props.ride.comment : undefined;

    const [departure, setDeparture] = useState<Stop | undefined>(getDefaultDeparture());
    const [arrival, setArrival] = useState<Stop | undefined>(getDefaultArrival());
    const [trafficCondition, setTrafficCondition] = useState<TrafficCondition>(getDefaultTrafficCondition());
    const [comment, setComment] = useState<string | undefined>(getDefaultComment());

    const [arrivalOdometerMin, setArrivalOdometerMin] = useState<number>(0);
    const [arrivalMomentMin, setArrivalMomentMin] = useState<Date | undefined>(undefined);

    const [validation, setValidation] = useState<{
        messages: string[], valid: boolean
    }>({
        messages: [],
        valid: false
    });

    const { onSubmit } = { ...props };

    useEffect(() => {
        if (departure) {
            setArrivalOdometerMin(departure.odometerValue + 1);
            setArrivalMomentMin(departure.moment);
        }
        if (departure && arrival && trafficCondition) {
            let ride: Ride = makeRide(departure!!, arrival!!, trafficCondition, comment);
            if (props.ride && props.ride.id !== undefined)
                ride = { ...ride, id: props.ride.id };
            setValidation((prev => ({
                ...prev,
                valid: isValidRide(ride),
                messages: validateRide(ride)
            })));
        }
    }, [departure, arrival, trafficCondition, comment, props.ride]);

    return <div id="ride-form-container">
        <StopForm datetime 
            title="Departure"
            value={departure}
            onChange={setDeparture}
        />
        <StopForm datetime
            title="Arrival"
            value={arrival}
            odometerMin={arrivalOdometerMin}
            momentMin={arrivalMomentMin}
            onChange={setArrival}
        />
        <Typography variant="h6">Retrospective</Typography>
        <Divider />
        <TrafficConditionField
            id="traffic-condition"
            label="Traffic condition"
            hint="Select the option that represent the best the traffic condition of your last ride."
            value={trafficCondition}
            onChange={setTrafficCondition}
        />
        <CommentField
            id="comment"
            label="Comment"
            hint="Let us know if you encountered any difficulties during your ride."
            value={comment}
            onChange={setComment}
        />
        <div className="ride-form-messages">
            {validation.messages.map(message => <Typography
                className="ride-form-message"
                variant="body2"
                color="error">
                {message}
            </Typography>)}
        </div>
        <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!validation.valid}
            onClick={async () => {

                if (props.ride) {
                    try {
                        if (departure)
                            await StopService.update(departure);
                        if (arrival)
                            await StopService.update(arrival)

                        onSubmit({
                            id: props.ride?.id,
                            departure: props.ride?.departure.id!!,
                            arrival: props.ride?.arrival?.id,
                            trafficCondition: trafficCondition,
                            comment: comment
                        });

                    } catch (error) {
                        if (props.onError) props.onError(error);
                    }
                } else {
                    try {
                        let departureId: number | undefined = undefined;
                        let arrivalId: number | undefined = undefined;
                        if (departure)
                            departureId = await StopService.create(departure);
                        if (arrival)
                            arrivalId = await StopService.create(arrival)

                        if (departureId && arrivalId) {
                            onSubmit({
                                departure: departureId,
                                arrival: arrivalId,
                                trafficCondition: trafficCondition,
                                comment: comment
                            });
                        } else {
                            console.error("The stops could not be created for whatever reason.");
                        }

                    } catch (error) {
                        if (props.onError) props.onError(error);
                    }
                }


            }}
        >
            Save
        </Button>
    </div >;
}

export default RideForm;