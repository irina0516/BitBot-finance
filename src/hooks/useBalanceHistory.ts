import { ethers, utils } from "ethers";
import { useEffect, useState } from "react"
import { useProvider } from "wagmi";
import ERC20 from "../abi/ERC20.json";
import config, { botAddress } from "../config";
import { AvailableERC20Tokens, TokenData } from "./useERC20";

const useBalanceHistory = (token: AvailableERC20Tokens) => {
    const [histories, setHistories] = useState<any>({ timeStampHistories: [], balanceHistories: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const { contract, decimals } = TokenData[token];
    useEffect(() => {
        (async () => {
            try {
                // init
                setLoading(true);
                setError(false);
                setHistories({ timeStampHistories: [], balanceHistories: [] })

                let xdatas = Array(20).fill(0);
                xdatas = xdatas.map((data, index) => {
                    return index
                })
                // 2S block time * 30(m) * 60 (h) * 24(d) * 5
                let timeUnit = 30 * 60 * 24 * 10;
                // contract
                const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools")
                const tokenContract = new ethers.Contract(contract, ERC20.abi, provider);
                const cBlockNumber = await provider.getBlockNumber();

                let balancePromises = (xdatas.map(async (data, index) => {
                    try {
                        return await tokenContract.balanceOf(botAddress, { blockTag: cBlockNumber - index * timeUnit });
                    } catch (err: any) {
                        return utils.parseUnits("0");
                    }
                })).reverse()
                let balanceHistories = (await Promise.all(balancePromises)).map((response) => {
                    return utils.formatUnits(response, String(decimals));
                });

                let blockPromises = (xdatas.map((data, index) => {
                    return provider.getBlock(cBlockNumber - index * timeUnit);
                })).reverse()
                let timeStampHistories = (await Promise.all(blockPromises)).map((response) => {
                    return response.timestamp;
                });

                setLoading(false);
                setHistories({ timeStampHistories, balanceHistories })
            } catch (err) {
                setError(true);
                setLoading(false);
                console.log(err);
                setHistories({ timeStampHistories: [], balanceHistories: [] })
            }
        })()
    }, [contract]);

    return { loading, histories, contract }
}

export const useTVLBalances = () => {
    const [TVLBalances, setTVLBalances] = useState({
        "SD": "0",
        "USDC": "0",
        "WFTM": "0"
    })

    useEffect(() => {
        const tokenKKeys: AvailableERC20Tokens[] = [
            "SD",
            "USDC",
            "WFTM"
        ]
        const balancePromises = tokenKKeys.map(async (key) => {
            try {
                const { contract, decimals } = TokenData[key];
                const provider = new ethers.providers.JsonRpcProvider("https://rpc.ftm.tools")
                const tokenContract = new ethers.Contract(contract, ERC20.abi, provider);
                const balance = await tokenContract.balanceOf(botAddress);
                return { [key]: utils.formatUnits(balance, decimals) }
            } catch (err: any) {
                console.log("useTVLBalances err", err.message);
                return { [key]: "0" }
            }
        })
        Promise.all(balancePromises).then((results) => {
            console.log("balancePromises", results);
            results.map((res) => {
                setTVLBalances(old => { return { ...old, ...res } })
            })
        })
    }, [])

    return { TVLBalances }
}

export default useBalanceHistory;