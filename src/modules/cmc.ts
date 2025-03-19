import axios from "axios";
import { BigNumber } from "bignumber.js";
import dotenv from "dotenv";

dotenv.config();

class CMC {
    private _headers: object;
    constructor() {
        this._headers = {
            "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
            Accept: "application/json",
        };
    }

    async idMap(symbol: string): Promise<any> {
        try {
            const response = await axios.get(
                `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${symbol}`,
                {
                    headers: this._headers,
                }
            );

            if (response.data.status.error_code !== 0) {
                throw new Error(response.data.status.error_message);
            }

            if (Object.values(response.data.data).length == 0) {
                throw new Error("The token does not existed");
            }

            return Object.values(response.data.data)[0];
        } catch (error) {
            console.error("CMC get token info error: ", error);
            return null;
        }
    }

    async price(currencyId: string): Promise<string> {
        try {
            const response = await axios.get(
                `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&id=${currencyId}`,
                {
                    headers: this._headers,
                }
            );
            const price = new BigNumber(response.data.data.quote.USD.price).toFixed(4, 1);
            return price;
        } catch (error: any) {
            console.error("CMC get token price error: ", error);
            return "0";
        }
    }

    async info(currencyId: string): Promise<any> {
        try {
            const response = await axios.get(
                `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${currencyId}`,
                {
                    headers: this._headers,
                }
            );

            if (response.data.status.error_code !== 0) {
                throw new Error(response.data.status.error_message);
            }

            if (Object.values(response.data.data).length == 0) {
                throw new Error("The token does not existed");
            }

            return Object.values(response.data.data)[0];
        } catch (error) {
            console.error("CMC get token info error: ", error);
            return null;
        }
    }
}

const cmc = new CMC();
export default cmc;
