import { DriverStatistics } from "../types";
import { Driver } from "../types/Driver";
import { Environment } from "./Environment";
import HttpService from "./HttpService";

export type DriverStatisticsData = {
    totalDistance: number;
    rides: number;
    locations: number;
}

export const hasCurrentUserADriver = (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            const userUrl = await HttpService.makeUrlForCurrentDriver();
            resolve(await HttpService.exist(userUrl));
        } catch (error) {
            reject(error);
        }
    });
};


export default class DriverService {

    public static async hasCurrentUserADriver(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                const userUrl = await HttpService.makeUrlForCurrentDriver();
                resolve(await HttpService.exist(userUrl));
            } catch (error) {
                reject(error);
            }
        });
    }

    public static async getCurrentDriver(): Promise<Driver | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const userUrl = await HttpService.makeUrlForCurrentDriver();
                if (await HttpService.exist(userUrl)) {
                    resolve(await HttpService.get<Driver>(userUrl))
                } else {
                    resolve(undefined);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    public static async getDriverStatistics(): Promise<DriverStatistics | undefined> {
        return new Promise(async (resolve, reject) => {
            try {
                const userUrl = await HttpService.makeUrlForCurrentDriver("/statistics");
                if (await HttpService.exist(userUrl)) {
                    const driver = await this.getCurrentDriver();
                    const stats = await HttpService.get<DriverStatisticsData>(userUrl);
                    if (driver) {
                        resolve({ driver: driver, ...stats });
                    } else {
                        resolve(undefined);
                    }
                } else {
                    resolve(undefined);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    public static async create(data: Driver): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const host: string = Environment.resourceServerUri;
                await HttpService.post<Driver>(`${host}/${HttpService.basePath}`, data);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

}