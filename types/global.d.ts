// types/global.d.ts
interface PetraWallet {
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
  isConnected: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;  // Add this line
}

interface Window {
  aptos?: PetraWallet;
}