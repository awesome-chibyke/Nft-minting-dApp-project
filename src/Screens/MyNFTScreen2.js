import React, { useState, useEffect, useContext } from "react";
import NFT from "../arctifacts/contracts/MyNFT2.sol/MyNFT2.json";
import { BallTriangle } from "react-loader-spinner";
import ConnectWalletContext from "../Contexts/ConnectWalletContext";

import { ethers } from "ethers";
import { Link } from "react-router-dom";
import Field from "./tailwind_sceens/Forms";
import Anchor from "./tailwind_sceens/Anchor";
import { contractAddress2 } from "../important/ContractAddress";
import { pinJSONToIPFS, sendFileToIPFS } from "../utils/pinata.js";
//screens
import MainNavbar from "./MainNavbar";
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// console.log(process.env.REACT_APP_ALCHEMY_KEY);
// const web3 = createAlchemyWeb3(process.env.REACT_APP_ALCHEMY_KEY);

export default function MyNFTScreen2() {
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
  const [mintStatus, setMintStatus] = useState(false);
  const [mintedNFT, setMintedNft] = useState(null);

  const [theFileImg, setTheFileImg] = useState(null);
  const [theFileValueError, setTheFileValueError] = useState(null);

  const [descriptionErrorValue, setDescriptionErrorValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  const [nameValue, setNameValue] = useState("");
  const [nameErrorValue, setNameErrorValue] = useState("");

  const [mainError, setMainError] = useState("");

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      await checkWalletIsConnected();
      if (walletConnectionDetails.status === true) {
        setWalletConnectStatus(walletConnectionDetails.status);
      }
    };
    checkIfWalletIsConnected();
  }, [walletConnectionDetails.status]);

  const setFileToBeUploaded = (e) => {
    setTheFileImg(e.target.files[0]);
  };

  // const mintCharacter = async () => {
  //   try {
  //     const { ethereum } = window;
  //     let nftContract;
  //     let errorStatus = 0;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       nftContract = new ethers.Contract(contractAddress2, NFT.abi, signer);

  //       if (addressValue === "") {
  //         setAddressErrorValue("An ethereum public address is required");
  //         errorStatus = 1;
  //       }

  //       if (urlValue === "") {
  //         setUrlErrorValue("Token URI is required");
  //         errorStatus = 1;
  //       }
  //       if (parseFloat(errorStatus) == parseFloat(1)) {
  //         return;
  //       }

  //       let nftTx = await nftContract.mintNFT(addressValue, urlValue);
  //       console.log("Minig....", nftTx.hash);
  //       setLoadingState(0);
  //       console.log(nftContract);
  //       let tx = await nftTx.wait();

  //       console.log("Mined!", tx);
  //       setLoadingState(1);

  //       let event = tx.events[0];
  //       let value = event.args[2];
  //       let tokenId = value.toNumber();

  //       getMintedNFT(tokenId);
  //     } else {
  //       setMintStatus(true);
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const getMintedNFT = async (tokenId) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(
          contractAddress2,
          NFT.abi,
          signer
        );

        //call the function that returns the token uri
        let tokenUri = await nftContract.tokenURI(tokenId);

        setMintedNft(tokenUri);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const minttheNFT = async () => {
    try {
      let errorStatus = 0;
      //error handling
      if (nameValue.trim() === "") {
        setNameErrorValue("❗Name is required.");
        errorStatus = 1;
      }
      if (descriptionValue.trim() === "") {
        setDescriptionErrorValue("❗Description is required");
        errorStatus = 1;
      }
      if (theFileImg === null) {
        setTheFileValueError("❗Description is required");
        errorStatus = 1;
      }

      if (errorStatus === 1) {
        return;
      }

      const returnedValue = await sendFileToIPFS(theFileImg);
      if (!returnedValue.success) {
        setTheFileValueError("😢 File Upload to pinata failed.");
        return;
      }

      //make metadata
      const metadata = {};
      metadata.name = nameValue;
      metadata.image = returnedValue.pinataUrl;
      metadata.description = descriptionValue;

      //pinata pin request
      const pinataResponse = await pinJSONToIPFS(metadata);

      if (!pinataResponse.success) {
        setTheFileValueError(
          "😢 Something went wrong while uploading your tokenURI."
        );
        return;
      }
      const tokenURI = pinataResponse.pinataUrl;

      //Provider
      const alchemyProvider = new ethers.providers.AlchemyProvider(
        "maticmum",
        process.env.REACT_APP_API_KEY
      );
      console.log(alchemyProvider);
      // Signer
      const signer = new ethers.Wallet(
        process.env.REACT_APP_POLYYGON_PRIVATE_KEY,
        alchemyProvider
      );
      window.contract = new ethers.Contract(contractAddress2, NFT.abi, signer);
      console.log(window.contract, "contract");
      //set up your Ethereum transaction
      // const transactionParameters = {
      //   to: contractAddress2, // Required except during contract publications.
      //   from: window.ethereum.selectedAddress, // must match user's active address.
      //   data: window.contract
      //     .mintNFT(window.ethereum.selectedAddress, tokenURI)
      //     .encodeABI(), //make call to NFT smart contract
      // };

      // //sign transaction via Metamask
      // try {
      //   const txHash = await window.ethereum.request({
      //     method: "eth_sendTransaction",
      //     params: [transactionParameters],
      //   });
      //   console.log(txHash);
      //   setCurrentTxHash(txHash);
      //   setMintStatus(true);
      // } catch (error) {
      //   setCurrentTxHash("");
      //   setMintStatus(false);
      // }

      let nftTx = await window.contract.mintNFT(
        window.ethereum.selectedAddress,
        tokenURI
      );
      console.log("Minig....", nftTx.hash);
      setLoadingState(0);
      let tx = await nftTx.wait();

      console.log("Mined!", tx);
      setLoadingState(1);

      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();

      getMintedNFT(tokenId);
    } catch (error) {
      setMainError(error.message);
      //console.log(error.message);
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

      <div className="bg-slate-900 h-screen mt-0 pt-10">
        <div className="shadow-lg border font-light border-solid rounded-sm py-12 px-8 w-4/5 my-auto mx-auto bg-white">
          <h1 className="text-2xl md:text-4xl text-gray-800 mb-3">Mint NFT</h1>
          <p className="text-gray-600">
            A simple smart contract for swift minting of NFTs
          </p>
          {mainError === "" ? (
            ""
          ) : (
            <p className="text-center text-rose-800">{mainError}</p>
          )}
          {loadingState === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <div className="text-lg font-bold mt-4">
                Click the `Mint NFT` Button below to mint NFTs
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
                Your Eternal Domain Characters
              </div>
              <div className="h-60 w-60 rounded-lg shadow-2xl shadow-[#6FFFE9] hover:scale-105 transition duration-500 ease-in-out">
                <div className="w-full text-center mt-14">
                  {/* <Anchor href={mintedNFT} target="_blank" className="w-full text-center mt-10" >Click To View NFT</a> */}
                  <Anchor href={mintedNFT} color="primary" target="_blank">
                    Click To View NFT
                  </Anchor>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4">
            {walletConnectStatus === true ? (
              <>
                <div className="w-4/5">
                  <Field
                    error={theFileValueError}
                    onChange={(e) => {
                      setFileToBeUploaded(e);
                      setDescriptionErrorValue("");
                    }}
                    type="file"
                    id="urlValue"
                    label="Upload File"
                    name="name"
                    placeholder="Upload File"
                    dot
                  />
                </div>
                <div className="w-4/5">
                  <Field
                    type="text"
                    error={nameErrorValue}
                    value={nameValue}
                    onChange={(e) => {
                      setNameValue(e.target.value);
                      setNameErrorValue("");
                    }}
                    id="descriptionErrorValue"
                    label="Description"
                    name="name"
                    placeholder="Description"
                    dot
                  />
                </div>
                <div className="w-4/5">
                  <Field
                    type="textarea"
                    error={descriptionErrorValue}
                    value={descriptionValue}
                    onChange={(e) => {
                      setDescriptionValue(e.target.value);
                      setDescriptionErrorValue("");
                    }}
                    id="descriptionErrorValue"
                    label="Description"
                    name="name"
                    placeholder="Description"
                    dot
                  />
                </div>
                <button
                  onClick={() => {
                    minttheNFT();
                  }}
                  className="text-white focus:outline-none shadow rounded px-6 py-2 font-medium transition ease-in duration-200 bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:ring-offset-green-100"
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
