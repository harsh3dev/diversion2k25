export async function getWalletAddress() {
  const walletAddress = localStorage.getItem('WalletAddress');
  return walletAddress;
}
