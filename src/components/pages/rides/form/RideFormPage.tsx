import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import RideService, { RideData } from "../../../../services/Rides";
import { Ride } from "../../../../types";
import { Page } from "../../../common";
import RideForm from "./RideForm";

type RideFormPageParams = { rideId: string };

type RideFormPageProps = RouteComponentProps<RideFormPageParams>;

interface IRideFormPageState {
    ride: Ride | undefined;
    isLoading: boolean;
    error: Error | undefined;
}

function RideFormPage({ match }: RideFormPageProps) {

    const [state, setState] = useState<IRideFormPageState>({
        ride: undefined,
        isLoading: match.params.rideId !== undefined,
        error: undefined
    });

    const title = (): string => match.params.rideId ? "Edit the ride" : "Create a new ride";
    const rideId = (): number => parseInt(match.params.rideId);

    useEffect(() => {
        if (match.params.rideId) {
            const rideId = parseInt(match.params.rideId);
            const fetchRide = async () => {
                try {
                    const ride = await RideService.findById(rideId);
                    setState(prev => ({ ...prev, ride: ride, isLoading: false }));
                } catch (error) {
                    setState(prev => ({ ...prev, error: error, isLoading: false }));
                }
            };
            fetchRide();
        }
    }, [match.params.rideId]);

    return <Page title={title()} isLoading={state.isLoading} error={state.error}>
        <RideForm
            ride={state.ride}
            isDriving={false}
            onChange={() => { }}
            onSubmit={async (data: RideData) => {
                try {
                    setState(prev => ({...prev, isLoading: true, error: undefined}));
                    let id = match.params.rideId;
                    if (state.ride) {
                        await RideService.updateById(rideId(), data);
                    } else {
                        id = String(await RideService.create(data));
                    }
                    window.location.href = `${window.location.origin}/rides/${id}`;
                } catch(error) {
                    setState(prev => ({...prev, isLoading: false, error: error}));
                }
            }}
            onError={(error: Error) => {
                setState(prev => ({ ...prev, error: error }));
            }}
        />
    </Page>;
}

export default RideFormPage;