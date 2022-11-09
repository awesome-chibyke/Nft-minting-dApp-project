//require("dotenv").config();
import { postRequest } from "./axios_call";

export const pinJSONToIPFS = async (JSONBody) => {
  try {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    //making axios POST request to Pinata ⬇️

    const request = await postRequest(url, JSONBody, {
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
      },
    });
    return {
      success: true,
      pinataUrl: "https://gateway.pinata.cloud/ipfs/" + request.data.IpfsHash,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const sendFileToIPFS = async (fileImg) => {
  if (fileImg) {
    try {
      const formData = new FormData();
      formData.append("file", fileImg);

      const request = await postRequest(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            pinata_api_key: `${process.env.REACT_APP_PINATA_KEY}`,
            pinata_secret_api_key: `${process.env.REACT_APP_PINATA_SECRET}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        pinataUrl: "https://gateway.pinata.cloud/ipfs/" + request.data.IpfsHash,
        pinataHash: request.data.IpfsHash,
      };
      //console.log(ImgHash);
      //Take a look at your Pinata Pinned section, you will see a new file added to you list.
    } catch (error) {
      //   console.log("Error sending File to IPFS: ");
      console.log(error.message);
      return {
        success: false,
        message: error.message,
      };
    }
  }
};
