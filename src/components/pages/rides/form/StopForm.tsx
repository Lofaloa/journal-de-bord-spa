import React, { useEffect, useState } from 'react';

import { LocationField, OdometerField } from './fields';
import { Location } from '../../../../types';
import DatetimeField from './fields/DatetimeField';
import { Typography, Divider } from '@material-ui/core';
import LocationService from '../../../../services/LocationService';
import { StopData } from '../../../../services/StopService';

interface IStopFormProps {
    title?: string;
    description?: string;
    odometerMin?: number;
    momentMin?: Date;
    value?: StopData
    onChange: (data: StopData) => void;
    datetime?: boolean;
    availableLocations?: Location[];
    onError?: (error: Error) => void;
}

/**
 * The fields are used to describe a stop. A stop is made of a moment, a
 * location and an odometer value.
 *
 * @param props aree the components properties.
 */
function StopForm(props: IStopFormProps) {

    const DEFAULT_LOCATION = { name: "Home", latitude: 0.0, longitude: 0.0 };

    const { onChange: handleStopChange } = props;
    const hasTitle = () => props.title !== undefined;
    const showDateTime = () => props.datetime === undefined ? false : props.datetime;
    const getOdometerMin = () => props.odometerMin === undefined ? 0 : props.odometerMin;

    const getDefaultMoment = () => props.value ? new Date(props.value.moment) : new Date();
    const getDefaultOdometer = () => props.value ? props.value.odometerValue : 0;
    const getLocations = () => props.availableLocations === undefined ? [] : props.availableLocations;
    const getDefaultLocation = () => {
        const locations = getLocations();
        return locations.length === 0 ? DEFAULT_LOCATION : locations[0];
    };

    const [moment, setMoment] = useState<Date>(getDefaultMoment());
    const [odometer, setOdometer] = useState<number>(getDefaultOdometer());
    const [location] = useState<Location>(getDefaultLocation());

    const [locationId, setLocationId] = useState<number | undefined>(undefined);

    const [locations, setLocations] = useState<Location[]>([]);

    const { id: stopId } = { ...props.value };
    const { onError } = { ...props };

    useEffect(() => {

        const fetchAvailableLocations = async () => {
            try {
                const data: Location[] = await LocationService.getAll();
                setLocations(data);
            } catch (error) {
                if (onError) onError(error);
            }
        };
        fetchAvailableLocations();

        if (locationId !== undefined && moment !== undefined) {
            handleStopChange({
                id: stopId ? stopId : undefined,
                moment: moment.toISOString(),
                locationId: locationId,
                odometerValue: odometer
            });
        }

    }, [moment, odometer, location, locationId, handleStopChange, onError, stopId]);

    return (
        <div>
            {
                hasTitle() && <div>
                    <Typography variant="h6">{props.title}</Typography>
                    <Divider/>
                </div>
            }
            <OdometerField
                id="stop-odometer-value"
                label="Odometer Value"
                placeholder="e.g. 454543"
                hint="Enter the current odometer value of your vehicle."
                value={odometer}
                min={getOdometerMin()}
                onChange={setOdometer}
            />
            <LocationField
                id="stop-location"
                label="Location"
                placeholder="e.g. Home"
                hint="Enter your current location name"
                options={locations}
                value={location}
                onChange={setLocationId}
            />
            { showDateTime() && <DatetimeField
                id="stop-datetime"
                label="Date and time"
                hint="Enter the stop date and time."
                min={props.momentMin}
                value={moment}
                onChange={setMoment}
            />}
        </div>
    );
}

export default StopForm;