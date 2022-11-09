import React, { useState, useEffect, useContext } from "react";
import NFT from "../arctifacts/contracts/MyNFT.sol/MyNFT.json";
import axios from "axios";
import { BallTriangle } from "react-loader-spinner";
import ConnectWalletContext from "../Contexts/ConnectWalletContext";
import { ethers } from "ethers";
import { Navigate, Link } from "react-router-dom";

import { contractAddress } from "../important/ContractAddress";

//screens
import MainNavbar from "./MainNavbar";

export default function MyNFTScreen() {
  const {
    checkWalletIsConnected,
    connectWalletHandler,
    walletConnectionDetails,
    walletListener,
  } = useContext(ConnectWalletContext);

  const [walletConnectStatus, setWalletConnectStatus] = useState(
    walletConnectionDetails.status
  );
  const [connectedWallet, setConnectedWalletAddress] = useState(""); //connected wallet value
  const [loadingState, setLoadingState] = useState(0);
  //const [mintNFTStatus, setMintNFTStatus] = useState(false);
  const [mintStatus, setMintStatus] = useState(0);
  const [mintedNFT, setMintedNft] = useState(null);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      await checkWalletIsConnected();
      if (walletConnectionDetails.status === true) {
        setWalletConnectStatus(walletConnectionDetails.status);
        setConnectedWalletAddress(walletConnectionDetails.wallet);
      }
    };
    checkIfWalletIsConnected();
  }, [walletConnectionDetails.status]);

  const mintCharacter = async () => {
    try {
      const { ethereum } = window;
      let nftContract;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        nftContract = new ethers.Contract(contractAddress, NFT.abi, signer);

        let nftTx = await nftContract.createMyNFT();
        console.log("Minig....", nftTx.hash);
        setLoadingState(0);
        let tx = await nftTx.wait();

        console.log("Mined!", tx);
        setLoadingState(1);

        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();

        getMintedNFT(tokenId);
      } else {
        setMintStatus(true);

        setWalletConnectStatus("Ethereum object doesn't exist!");
        setConnectedWalletAddress("");
      }
    } catch (error) {
      setWalletConnectStatus(error.message);
      setConnectedWalletAddress("");
    }
  };

  const getMintedNFT = async (tokenId) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddress,
          NFT.abi,
          signer
        );

        //call the function that returns the token uri
        let tokenUri = await nftContract.tokenURI(tokenId);
        let data = await axios.get(tokenUri);
        let meta = data.data;

        setMintedNft(meta.image);
      } else {
        setWalletConnectStatus("Ethereum object doesn't exist!");
        setConnectedWalletAddress("");
      }
    } catch (error) {
      setWalletConnectStatus(error.message);
      setConnectedWalletAddress("");
    }
  };

  const callConnectWalletHandler = async () => {
    await connectWalletHandler();
    if (walletConnectionDetails.status === true) {
      setWalletConnectStatus(walletConnectionDetails.status);
      setConnectedWalletAddress(walletConnectionDetails.wallet);
    }
  };

  useEffect(() => {
    const reUpdateWalletStatus = async () => {
      await walletListener();
      setWalletConnectStatus(walletConnectionDetails.status);
      setConnectedWalletAddress(walletConnectionDetails.wallet);
    };
    reUpdateWalletStatus();
  }, [walletConnectionDetails.status]);

  return (
    <>
      <MainNavbar
        walletConnectStatus={walletConnectStatus}
        connectedWallet={connectedWallet}
        callConnectWalletHandler={callConnectWalletHandler}
      />

      <div className="bg-slate-900 h-screen mt-0 pt-40">
        <div className="shadow-lg border font-light border-solid rounded-sm py-12 px-8 w-4/5 my-auto mx-auto bg-white">
          <h1 className="text-2xl md:text-4xl text-gray-800 mb-3">Mint NFT</h1>
          <p className="text-gray-600">
            Click the `Mint NFT` Button below to mint NFTs
          </p>

          {loadingState === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <div className="text-lg font-bold">
                Processing your transaction
              </div>
              <BallTriangle
                className="flex justify-center items-center pt-12"
                type="TailSpin"
                color="#d3d3d3"
                height={40}
                width={40}
              />
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <div className="font-semibold text-lg text-center mb-4">
                Your Eternal Domain Character
              </div>
              <img
                src={mintedNFT}
                alt=""
                className="h-60 w-60 rounded-lg shadow-2xl shadow-[#6FFFE9] hover:scale-105 transition duration-500 ease-in-out"
              />
            </div>
          )}
          <div className="mt-8">
            {walletConnectStatus === true ? (
              <>
                <button
                  onClick={() => mintCharacter()}
                  className="text-white focus:outline-none shadow rounded px-6 py-2 font-medium transition ease-in duration-200 bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:ring-offset-green-100"
                  to="/my_nft_screen"
                >
                  Mint NFT
                </button>

                <Link
                  className="ml-4 text-white focus:outline-none shadow rounded px-6 py-2 font-medium transition ease-in duration-200 bg-indigo-900 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900 focus:ring-offset-indigo-100"
                  to="/"
                >
                  Home
                </Link>
              </>
            ) : (
              <Link
                className="ml-4 text-white focus:outline-none shadow rounded px-6 py-2 font-medium transition ease-in duration-200 bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:ring-offset-green-100"
                to="/my_nft_screen"
              >
                Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
