class Utils {
    /**
     * Delay by amount of milliseconds asynchronously
     * @param ms Number of milliseconds to delay
     * @returns Promise
     */
    delay = (ms: number) => {
        return new Promise(res => setTimeout(res, ms));
    }

    /**
     * Random number generator
     * @param min Minimum number
     * @param max Maximum number
     * @returns Number
     */
    rng = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    /**
     * Check if a String is a number
     * @param str String to check
     * @returns boolean
     */
    isNumeric = (str: string | number) =>  {
        if (typeof str != "string") return false;
        return !isNaN(parseInt(str)) && !isNaN(parseFloat(str))
    }
}

export default Utils;