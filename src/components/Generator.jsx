import { useCallback, useState } from "react";
import Papa from "papaparse";
import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import copy from "copy-to-clipboard";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconCopy } from "@tabler/icons-react";

export default function Generate() {
  const [generatedMerkleRoot, setGeneratedMerkleRoot] = useState("");
  const [invalidAddresses, setInvalidAddresses] = useState([]);
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([]);

  const data = invalidAddresses.map((address) => ({
    address,
  }));

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
      console.log(e);
    }
  };

  const handleAddresses = async (e) => {
    const file = e.target.files && e.target.files[0];
    const addresses = await parsedFile(file);

    const lowercaseFileContent = addresses.map((address) =>
      address.toLowerCase()
    );

    // This is to handle the case where the last line of the file is the delimiter
    const lastIndexValue =
      lowercaseFileContent[lowercaseFileContent.length - 1];
    if (lastIndexValue.length <= 1) lowercaseFileContent.pop();

    // check that all addresses are valid
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

  const copyToClipboard = () => {
    copy(JSON.stringify(generatedMerkleRoot));
    toast.success("Copied to clipboard");
  };

  const copyAddressesToClipboard = () => {
    copy(JSON.stringify(whitelistedAddresses));
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <div className="mx-auto max-w-7xl border-b py-4 text-[40px] font-light sm:px-6 lg:px-8 text-[#C8D1D9]">
        Merkle Root Generator
      </div>
      <p className="mx-auto mb-5 max-w-7xl border-b py-4 text-xl font-light sm:px-6 lg:px-8 text-[#C8D1D9] ">
        The addresses need to be upload as a CSV file. The CSV file should only
        contain the addresses and nothing else. The merkle root will be
        generated automatically. With the provided merkle root you can submit it
        to your smart contract. The smart contract will then verify the merkle
        root and the merkle proof to verify the address is whitelisted. Only
        valid whitelisted addresses will be able to mint the NFT.
      </p>

      <div className="max-w-9xl mx-auto p-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* inputs */}
          {invalidAddresses.length > 0 ? (
            <div className="md:w-100 mt-20 rounded-lg  p-4 shadow-lg">
              <div className="m-1">
                <button className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <CSVLink {...csvReport}> Download Invalid Addresses</CSVLink>
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Please fix the invalid addresses and{" "}
                <span
                  className="text-indigo-600 hover:text-indigo-500 cursor-pointer"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  try again.
                </span>
              </p>
            </div>
          ) : (
            <div className="md:w-100 mt-20">
              <div className="m-1">
                <div class="flex justify-center">
                  <div class="mb-3 w-96">
                    <input
                      class="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding py-[0.32rem] px-3 text-base font-normal text-white transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-indigo-700 file:px-3 file:py-[0.32rem] file:text-white file:transition file:duration-150 file:ease-in-out file:[margin-inline-end:0.75rem] file:[border-inline-end-width:1px] hover:file:bg-indigo-500 focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none"
                      type="file"
                      id="formFile"
                      onChange={(e) => handleAddresses(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* outputs */}
          {generatedMerkleRoot && (
            <>
              <div className="md:w-100 mt-10 rounded-lg bg-gray-200 p-4 shadow-lg">
                <div className="mx-auto max-w-screen-lg">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-3 text-left">{generatedMerkleRoot}</th>
                        <th className="pl-3 text-center cursor-pointer hover:bg-gray-300 hover:rounded-md">
                          {<IconCopy onClick={copyToClipboard} />}
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={copyAddressesToClipboard}
                >
                  Copy Address Array
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
