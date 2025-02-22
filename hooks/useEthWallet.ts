'use client';
import { metadata } from '@/app/layout';
import { wagmiAdapter } from '@/lib/wagmi/config';
import { createAppKit } from '@reown/appkit';
import { useAppKitState, useAppKitAccount } from '@reown/appkit/react';
import { mainnet, arbitrum, avalanche, base, optimism, polygon } from '@reown/appkit/networks'
import { projectId } from '@/lib/wagmi/config';

const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [mainnet, arbitrum, avalanche, base, optimism, polygon],
    defaultNetwork: mainnet,
    features: {
      analytics: true,
    }
  })


export default function useEthWallet () {
    const state = useAppKitState();
    const { address, isConnected, embeddedWalletInfo } = useAppKitAccount();

    return {
        loading: state.loading,
        open: state.open,
        address,
        isConnected,
        user: embeddedWalletInfo?.user,
    };
};
