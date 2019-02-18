/**
* Common driver utility functions.
*/
export declare class DriverUtils {
    /**
     * Normalizes and builds a new driver options.
     * Extracts settings from connection url and sets to a new options object.
     */
    static buildDriverOptions(options: any, buildOptions?: {
        useSid: boolean;
    }): any;
    /**
     * Extracts connection data from the connection url.
     */
    private static parseConnectionUrl;
}
