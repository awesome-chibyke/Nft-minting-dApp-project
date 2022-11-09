require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    maticmum: {
      url: process.env.POLYYGON_URL,
      accounts: [`0x${process.env.POLYYGON_PRIVATE_KEY}`],
    },
  },
};
