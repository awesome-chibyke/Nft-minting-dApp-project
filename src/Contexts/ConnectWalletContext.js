import { createContext, useContext, useEffect, useState } from "react";

const ConnectWalletContext = createContext();

//UserContextProvider
export const ConnectWalletProvider = ({ children }) => {
  //const [loadingWallet, setLoadingWallet] = useState(true);
  const [walletConnectionDetails, setWalletConnectionDetails] = useState({
    status: false,
    message: "",
    wallet: "",
  });

  //function that checks if the wallet is connected
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      setWalletConnectionDetails({
        ...walletConnectionDetails,
        status: false,
        message: "Please Install Meta Mask Wallet on Your Browser",
        wallet: "",
      });
    }

    try {
      //request connect to the ethereum account on metamask
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length !== 0) {
        setWalletConnectionDetails({
          ...walletConnectionDetails,
          status: true,
          message: "Metamask is connected",
          wallet: accounts[0],
        });
      } else {
        setWalletConnectionDetails({
          ...walletConnectionDetails,
          status: false,
          message: "No authorised account found",
          wallet: "",
        });
      }
    } catch (err) {
      setWalletConnectionDetails({
        ...walletConnectionDetails,
        status: false,
        message: err.message,
        wallet: "",
      });
    }
  };

  //connect wallet unction
  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setWalletConnectionDetails({
        ...walletConnectionDetails,
        status: false,
        wallet: "",
        message: "Please install Meta Mask Wallet",
      });
    }

    try {
      //request connect to the ethereum account on metamask
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletConnectionDetails({
        ...walletConnectionDetails,
        status: true,
        message: "Metamask is connected",
        wallet: accounts[0],
      });
    } catch (err) {
      setWalletConnectionDetails({
        ...walletConnectionDetails,
        status: false,
        wallet: "",
        message: err.message,
      });
    }
  };

  const walletListener = async () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletConnectionDetails({
            ...walletConnectionDetails,
            status: true,
            message: "Metamask is connected",
            wallet: accounts[0],
          });
        } else {
          setWalletConnectionDetails({
            ...walletConnectionDetails,
            wallet: "",
            status: false,
            message: "🦊 Connect to Metamask using the top right button.",
          });
        }
      });
    } else {
      setWalletConnectionDetails({
        ...walletConnectionDetails,
        wallet: "",
        status: false,
        message:
          "You must install Metamask, a virtual Ethereum wallet, in your browser.",
      });
    }
  };

  return (
    <ConnectWalletContext.Provider
      value={{
        checkWalletIsConnected,
        connectWalletHandler,
        walletConnectionDetails,
        walletListener,
      }}
    >
      {/* {console.log(walletConnectionDetails)} */}
      {children}
    </ConnectWalletContext.Provider>
  );
};

export default ConnectWalletContext;
