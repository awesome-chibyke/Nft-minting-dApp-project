import React from "react";
import {
  Navbar,
  NavbarLink,
  NavbarItem,
  NavbarNav,
  NavbarCollapse,
  NavbarBrand,
  NavbarToggler,
} from "./tailwind_sceens/Navbar";

export default function MainNavbar({
  walletConnectStatus,
  connectedWallet,
  callConnectWalletHandler,
}) {
  return (
    <>
      <Navbar className="bg-indigo-900 text-white">
        <NavbarBrand href="#"></NavbarBrand>
        <NavbarToggler />
        <NavbarCollapse>
          <NavbarNav orientation="end">
            {walletConnectStatus === true ? (
              <>
                <button className="text-white focus:outline-none shadow rounded px-6 py-2 font-medium transition ease-in duration-200 bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:ring-offset-green-100">
                  {"Connected: " +
                    String(connectedWallet).substring(0, 6) +
                    "..." +
                    String(connectedWallet).substring(38)}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => callConnectWalletHandler()}
                  className="text-white focus:outline-none shadow rounded px-6 py-2 font-medium transition ease-in duration-200 bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:ring-offset-green-100"
                  to="/my_nft_screen"
                >
                  Connect Wallet
                </button>
              </>
            )}
          </NavbarNav>
        </NavbarCollapse>
      </Navbar>
    </>
  );
}
