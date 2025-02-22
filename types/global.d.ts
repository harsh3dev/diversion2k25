// global.d.ts
interface Window {
    aptos?: PetraWallet;
  }
  
  // Define the PetraWallet interface
  interface PetraWallet {
    connect: () => Promise<{ address: string }>;
    account: () => Promise<{ address: string }>;
    isConnected: () => Promise<boolean>;
    disconnect: () => Promise<void>;
  }
  