import { Ride } from "../types";
import { Progress } from "../types/Progress";
import { Environment } from "./Environment";
import * as data from "./sample.json";

export class ResourcesService {

    private _resourceServerUri: string;

    constructor() {
        this._resourceServerUri = Environment.resourceServerUri;
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Gets the objective of the user with the specified id. The objective is
     * expressed in number of kilometers.
     *
     * TODO: the objective should be fetch from the backend.
     *
     * @param userId is the id of the user to get the picture for.
     */
    public async getObjective(userId: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.sleep(1000);
                resolve(data.objective);
            } catch (error) {
               reject(error);
            }
        });
    }

    /**
     * Gets the uri to the picture of the user with the specified id. If the
     * user has no defined picture then a uri to a placeholder is returned.
     *
     * @param userId is the id of the user to get the picture for.
     */
    public async getImageUri(userId: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.sleep(1000);
                resolve(data.user.image);
            } catch (error) {
               reject(error);
            }
        });
    }

    /**
     * Gets all the rides driven by the specified user.
     *
     * @param userId is the identifier of the specified user.
     */
    public async getRides(userId: string): Promise<Ride[]> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.sleep(1000);
                resolve(ResourcesService.readRidesFromSample());
            } catch (error) {
               reject(error);
            }
        });
    }

    /**
     * Gets the progress for the specified user.
     *
     * @param userId is the identifier of the specified user.
     */
    public async getProgress(userId: string): Promise<Progress> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.sleep(1000);
                resolve({drivenDistance: 543, distanceObjective: 1500});
            } catch (error) {
               reject(error);
            }
        });
    }

    public async deleteJournal(userId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.sleep(1000);
                resolve();
            } catch (error) {
               reject(error);
            }
        });
    }

    /**
     * This method only serve for demo purposes.
     */
    private static readRidesFromSample(): Ride[] {
        return data.rides.map((element, index) => ({
            id: index,
            driverPseudonym: element.driverPseudonym,
            departure: {
                moment: new Date(element.departure.moment),
                location: {
                    id: element.departure.location.id,
                    name: element.departure.location.name,
                    longitude: element.departure.location.longitude,
                    latitude: element.departure.location.latitude
                },
                odometerValue: element.departure.odometerValue
            },
            arrival: {
                moment: new Date(element.arrival.moment),
                location: {
                    id: element.arrival.location.id,
                    name: element.arrival.location.name,
                    longitude: element.arrival.location.longitude,
                    latitude: element.arrival.location.latitude
                },
                odometerValue: element.arrival.odometerValue
            },
            comment: element.comment,
            trafficCondition: element.trafficCondition
        }));
    }

}