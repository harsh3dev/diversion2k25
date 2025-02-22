import React, { useState, useEffect } from 'react';
import { AptosClient } from 'aptos';
import { LogOut } from 'lucide-react';

// Define the PetraWallet interface
interface PetraWallet {
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
  isConnected: () => Promise<boolean>;
  disconnect: () => Promise<void>;
}

const PETRA_WALLET_URL = "https://aptos.dev";

const ConnectPetraWallet: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // AptosClient for blockchain interaction (optional, depends on your use case)
  const client = new AptosClient(PETRA_WALLET_URL);

  // Function to connect the wallet
  const connectWallet = async () => {
    try {
      if (window.aptos) {
        const wallet = window.aptos as PetraWallet;

        // Request to connect to the wallet
        const response = await wallet.connect();
        setWalletAddress(response.address);
        setIsConnected(true);
        setError(null);
      } else {
        setError("Petra Wallet is not installed. Please install it from the Chrome Web Store.");
      }
    } catch (err) {
      setError("Error connecting to Petra Wallet.");
      console.error(err);
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = async () => {
    try {
      if (window.aptos) {
        const wallet = window.aptos as PetraWallet;
        await wallet.disconnect();
        setWalletAddress(null);
        setIsConnected(false);
      }
    } catch (err) {
      console.error("Error disconnecting from Petra Wallet:", err);
    }
  };

  // Check if Petra Wallet is connected on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.aptos) {
        const wallet = window.aptos as PetraWallet;

        try {
          const connected = await wallet.isConnected();
          if (connected) {
            const account = await wallet.account();
            setWalletAddress(account.address);
            setIsConnected(true);
          }
        } catch (err) {
          console.error("Error checking Petra Wallet connection:", err);
        }
      }
    };

    checkWalletConnection();
  }, []);

  return (
    <div className="wallet-connection">
      {isConnected ? (
        <div>
          {/* <p>Connected Wallet: {walletAddress}</p> */}
          <button onClick={disconnectWallet} className="btn-disconnect bg-[#e74f57c1] p-3 rounded-full font-bold">
          <LogOut size={16} />
          </button>
        </div>
      ) : (
        <div>
          <button onClick={connectWallet} className="btn-connect bg-[#4F68E7] px-4 py-2 rounded-full font-bold">
            Connect Petra Wallet
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ConnectPetraWallet;
