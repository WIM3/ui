import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";


export const getUpdateData = async (): Promise<string[]> => {
    const connection = new EvmPriceServiceConnection(
        "https://hermes.pyth.network/"
    );

    const priceIds = [
        // You can find the ids of prices at https://pyth.network/developers/price-feed-ids#pyth-evm-testnet
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD price id in testnet
    ];
    
    const updateDate = await connection.getPriceFeedsUpdateData(priceIds)
    return updateDate
}

let d;
getUpdateData().then((data) => {
    d = data
})

console.log(d)