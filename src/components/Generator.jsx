import React, { useCallback, useState } from "react";
import Papa from "papaparse";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import "react-toastify/dist/ReactToastify.css";
import { IconCopy } from "@tabler/icons-react";

export default function Generate() {
  const [generatedMerkleRoot, setGeneratedMerkleRoot] = useState("");
  const [invalidAddresses, setInvalidAddresses] = useState([]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);

  const data = invalidAddresses.map((address) => ({ address }));

  const csvReport = {
    data,
    filename: "invalid-addresses.csv",
  };

  const generateMerkleProof = useCallback(async (addresses) => {
    const leaves = addresses.map((v) => ethers.utils.keccak256(v));
    const tree = new MerkleTree(leaves, ethers.utils.keccak256, {
      sort: true,
    });
    const merkleRoot = tree.getHexRoot();
    return merkleRoot;
  }, []);

  const parsedFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          resolve(results.data.flat(Infinity));
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  const createRootHashFromAddressList = async (lowercaseFileContent) => {
    try {
      const root = await generateMerkleProof(lowercaseFileContent);
      setGeneratedMerkleRoot(root);
    } catch (e) {
      console.error(e);
    }
  };

  const removeEmptyCells = (addresses) => {
    const validAddresses = addresses.filter((address) => address.length > 1);
    return validAddresses;
  };

  const handleAddresses = async (e) => {
    const file = e.target.files && e.target.files[0];
    const addresses = await parsedFile(file);

    const nonEmptyAddresses = removeEmptyCells(addresses);

    const lowercaseFileContent = nonEmptyAddresses.map((address) =>
      address.toLowerCase()
    );

    const lastIndexValue =
      lowercaseFileContent[lowercaseFileContent.length - 1];
    if (lastIndexValue.length <= 1) lowercaseFileContent.pop();

    const invalidAddresses = lowercaseFileContent.filter(
      (address) => !ethers.utils.isAddress(address)
    );

    if (invalidAddresses.length > 0) {
      setInvalidAddresses(invalidAddresses);
      toast.error("Invalid addresses found in CSV file");
      return;
    }
    setWhitelistedAddresses(lowercaseFileContent);
    createRootHashFromAddressList(lowercaseFileContent);
  };

  const copyRootToClipboard = () => {
    copy(JSON.stringify(generatedMerkleRoot));
    toast.success("Copied to clipboard");
  };

  const copyAddressesToClipboard = () => {
    copy(JSON.stringify(whitelistedAddresses));
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mx-10">
      <div className="flex mt-10 mx-auto max-w-7xl text-3xl font-bold text-white font-extrabold items-center justify-between">
        <span>Merkle Root Generator</span>
        <div className="flex items-center">
          {/* <img
            className="w-30 h-5 mr-2"
            src="https://img.shields.io/github/stars/passandscore/merkle-root-generator"
            alt="GitHub Repo stars"
          /> */}
          <button className="text-white hover:text-yellow-300 text-sm focus:outline-none">
            <a href="https://github.com/passandscore/merkle-root-generator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-star"
                width="35"
                height="35"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#4299E1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
              </svg>
            </a>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-b pb-4 text-lg  text-[#4299E1] justify-between flex ">
        <span> NFT Whitelists</span>
      </div>
      <p className="mx-auto  max-w-7xl  pt-4  text-[#98A5B7] font-raleway">
        - The addresses need to be uploaded as a CSV file.
      </p>
      <p className="mx-auto  max-w-7xl  text-[#98A5B7] font-raleway">
        - The CSV file should only contain the addresses. No empty rows or
        columns❗️
      </p>
      <p className="mx-auto  max-w-7xl  pb-4  text-[#98A5B7] font-raleway">
        - The Merkle root will be generated automatically..
      </p>
      <p className="mx-auto mb-5 max-w-7xl border-b pt-2 pb-3   font-raleway text-[#98A5B7] ">
        With the provided Merkle root, you can submit it to your smart contract.
        The smart contract will then verify the Merkle root and the Merkle proof
        to verify the address is whitelisted. Only valid whitelisted addresses
        will be able to mint the NFT.
      </p>

      <div>
        <div className="mx-auto ">
          {/* inputs */}
          {invalidAddresses.length > 0 ? (
            <div className="w-full mt-20">
              <div className="flex justify-center">
                <button className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-lg font-medium font-raleway text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <CSVLink {...csvReport}> Download Invalid Addresses</CSVLink>
                </button>
              </div>
              <p className="mt-4 text-xl text-white text-center font-raleway">
                Please fix the invalid addresses and try again.
              </p>

              <p
                className="mt-4 text-sm text-white text-center font-raleway text-red-500 cursor-pointer"
                onClick={() => {
                  setInvalidAddresses([]);
                  setGeneratedMerkleRoot("");
                  setWhitelistedAddresses([]);
                }}
              >
                RESET
              </p>
            </div>
          ) : (
            <div>
              <div className="mx-auto max-w-7xl">
                <input
                  className="w-full  text-sm text-white  overflow-hidden focus:border-primary focus:outline-none"
                  type="file"
                  id="formFile"
                  onChange={(e) => handleAddresses(e)}
                />
              </div>
            </div>
          )}

          {/* outputs */}
          {generatedMerkleRoot && invalidAddresses.length === 0 && (
            <div>
              <div className="mx-auto max-w-7xl">
                <div className="mt-10 rounded-lg bg-gray-800 p-3 shadow-lg text-md w-auto text-center text-gray-200 overflow-hidden text-ellipsis">
                  {generatedMerkleRoot}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 mx-2 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={copyRootToClipboard}
                  >
                    <IconCopy size={16} />
                    <p className="pl-2 ">Merkle Root</p>
                  </button>
                  <button
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2 py-1 text-lg font-sm text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={copyAddressesToClipboard}
                  >
                    <IconCopy size={16} />
                    <p className="pl-2 text-sm">Address Array</p>
                  </button>
                </div>

                <p className="mt-4 text-lg text-[#4299E1] text-right text-raleway">{`${whitelistedAddresses.length} total addresses`}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
