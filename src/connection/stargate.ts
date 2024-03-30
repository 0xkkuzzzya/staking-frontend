import { SigningStargateClient } from "@cosmjs/stargate";  
import { QUBE_TESTNET_INFO } from "../constants";
import { Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes, GasPrice } from "@cosmjs/stargate";
import {
        MsgClaim,
        MsgLiquidStake,
        MsgLiquidUnstake,
        MsgRedeem,
        COSMOS_LIQUID_STAKE_URL,
        COSMOS_LIQUID_UN_STAKE_URL,
        REDEEM_URL,
        CLAIM_URL,
} from "../constants/core/liquidstakeibc/v1beta1/msgs";

export async function InitSigner() {
        const reg = new Registry(defaultRegistryTypes)
        reg.register(COSMOS_LIQUID_STAKE_URL, MsgLiquidStake)
        reg.register(COSMOS_LIQUID_UN_STAKE_URL, MsgLiquidUnstake)
        reg.register(REDEEM_URL, MsgRedeem)
        reg.register(CLAIM_URL, MsgClaim)

        var offlineSigner = (window as any).getOfflineSigner(QUBE_TESTNET_INFO.chainId);
        var accounts = await offlineSigner.getAccounts();

        var client = await SigningStargateClient.connectWithSigner(
                QUBE_TESTNET_INFO.rpc,
                offlineSigner,
                {
                        registry: reg,
                        gasPrice: GasPrice.fromString(Number(QUBE_TESTNET_INFO.feeCurrencies[0].gasPriceStep.average).toFixed(0) + QUBE_TESTNET_INFO.feeCurrencies[0].coinMinimalDenom)
                        
                }
        );

        return ({init: true, client: client, accounts: accounts});
}