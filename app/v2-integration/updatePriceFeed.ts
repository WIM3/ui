import { ethers, providers } from "ethers";
import PythAbi from "@pythnetwork/pyth-sdk-solidity/abis/IPyth.json" assert { type: "json" };
 

export const updatePriceFeed = async (data: string) => {
    const contractAddress = '0x0708325268dF9F66270F1401206434524814508b';
    const provider = new providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PythAbi, signer);
    
    const updateData = [data];
    const [feeAmount] = await contract.getUpdateFee(updateData);
    const fee = BigInt(feeAmount)
    
    const tx = await contract.updatePriceFeeds(updateData, {value: fee});
    const receipt = await tx.wait();
}

