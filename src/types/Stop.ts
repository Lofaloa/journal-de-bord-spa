import moment from "moment";
import { Location } from "./Location";

export type Stop = {
    id?: number;
    moment: Date;
    location: Location;
    odometerValue: number;
};

export const isStopBefore = (stop: Stop, previousStop: Stop): boolean => {
    const previous = moment(previousStop.moment).second(0).milliseconds(0);
    const current = moment(stop.moment).second(0).milliseconds(0);
    return previous.isBefore(current);
}

export const getMomentLocalISOString = (moment: Date): string => {
    return new Date(moment.getTime() - (moment.getTimezoneOffset() * 60000)).toISOString().slice(0, -1);
};