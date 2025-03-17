import { describe, expect, it } from '@jest/globals';
import cmc from "./cmc.js";

describe("CMC", () => {
    it("idMap", async () => {
        const currencyId = await cmc.idMap("BTC");
        console.log('currencyId', currencyId);
    });

    it("price", async () => {
        const idResult = await cmc.idMap("BTC");
        const price = await cmc.price(idResult.id);
        console.log('price', price);
    });
});
