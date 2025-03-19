import { describe, expect, it } from '@jest/globals';
import cmc from "./cmc.js";

describe("CMC", () => {
    it("idMap", async () => {
        const idResult = await cmc.idMap("BTC");
        console.log('==========idResult', idResult);
    });

    it("info", async () => {
        const idResult = await cmc.idMap("BTC");
        const info = await cmc.info(idResult.id);
        console.log('==========info', info);
    });

    it("price", async () => {
        const idResult = await cmc.idMap("BTC");
        const price = await cmc.price(idResult.id);
        console.log('==========price', price);
    });
});
