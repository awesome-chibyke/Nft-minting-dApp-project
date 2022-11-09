import React, { useState, useEffect, useContext } from "react";
import ConnectWalletContext from "../Contexts/ConnectWalletContext";
import { Link } from "react-router-dom";

export default function ConnectWalletScreen() {
  const {
    checkWalletIsConnected,
    connectWalletHandler,
    walletConnectionDetails,
    walletListener,
  } = useContext(ConnectWalletContext);

  const [walletConnectStatus, setWalletConnectStatus] = useState(
    walletConnectionDetails.status
  );

  const callConnectWalletHandler = async () => {
    await connectWalletHandler();
    if (walletConnectionDetails.status === true) {
      setWalletConnectStatus(walletConnectionDetails.status);
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      await checkWalletIsConnected();
      if (walletConnectionDetails.status === true) {
        setWalletConnectStatus(walletConnectionDetails.status);
      }
    };
    checkIfWalletIsConnected();
  }, [walletConnectionDetails.status]);

  useEffect(() => {
    const reUpdateWalletStatus = async () => {
      await walletListener();
      setWalletConnectStatus(walletConnectionDetails.status);
    };
    reUpdateWalletStatus();
  }, [walletConnectionDetails.status]);

  return (
    <>
      <div className="bg-slate-900 h-screen mt-0 pt-40">
        <div className="shadow-lg border font-light border-solid rounded-sm py-12 px-8 w-4/5 my-auto mx-auto bg-white">
          <h1 className="text-2xl md:text-4xl text-gray-800 mb-3">Mint NFT</h1>
          <p className="text-gray-600">
            A simple smart contract for swift minting of NFTs
          </p>
          {walletConnectStatus === false ? (
            <button
              onClick={async () => await callConnectWalletHandler()}
              className="text-sm px-6 py-1 mt-4 text-white focus:outline-none bg-blue-500"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="mt-8">
              {/* <Link
                className="text-white focus:outline-none shadow rounded px-6 py-2 font-medium transition ease-in duration-200 bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 focus:ring-offset-blue-100"
                to="/my_nft_screen"
              >
                Mint Using First Contract
              </Link> */}

              <Link
                className="ml-4 text-white focus:outline-none shadow rounded px-6 py-2 font-medium transition ease-in duration-200 bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:ring-offset-green-100"
                to="/my_nft_screen_2"
              >
                Click to continue
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
