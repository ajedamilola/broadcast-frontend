import { useContext, useLayoutEffect, useState } from "react";
import { AppContext } from "../AppContext";
import { Report } from "notiflix";
import { BrowserProvider } from "ethers";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setEthersData, ethersData, setAddress } = useContext(AppContext);
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (ethersData.provider && ethersData.signer) {
      navigate("/messenger");
    }
  }, [ethersData, navigate]);

  async function handleConnect() {
    setConnecting(true);
    if (window.ethereum) {
      try {
        let provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        if (network.chainId != 421614) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x66eee' }], // 421614 in hexadecimal
            });
          } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x66eee',
                  chainName: 'Arbitrum Sepolia',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
                  blockExplorerUrls: ['https://sepolia.arbiscan.io/']
                }],
              });
            } else {
              throw switchError;
            }
          }
          // After switching or adding the network, reinitialize the provider
          provider = new BrowserProvider(window.ethereum);
        }

        const signer = await provider.getSigner();
        setEthersData({
          provider,
          signer,
        });
        setAddress(await signer.getAddress());
      } catch (error) {
        Report.failure(
          "An Error occurred",
          "Unable to sign in to wallet. Please try again."
        );
        console.log(error);
      }
    } else {
      Report.warning(
        "Unable to connect wallet",
        "Try getting a wallet plugin like MetaMask to proceed"
      );
    }
    setConnecting(false);
  }

  return (
    <div className='font-montserrat h-[100dvh] flex items-center justify-center bg-gradient-to-r from-[#0389c9] to-[#03a9f4]'>
      <div className='bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300'>
        <h1 className='text-4xl font-bold text-center mb-6 text-[#0389c9]'>
          Welcome
        </h1>
        <p className='text-xl text-center mb-8 text-gray-600'>
          Connect your MetaMask account to get started...
        </p>
        <button
          className='w-full bg-[#0389c9] hover:bg-[#026d9e] text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-70'
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? "Connecting..." : "Connect MetaMask"}
        </button>
        <p className='mt-6 text-sm text-center text-gray-500'>
          Don&apos;t have MetaMask?{" "}
          <a
            href='https://metamask.io/'
            className='text-[#0389c9] hover:underline'
          >
            Get it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
