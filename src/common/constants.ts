import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { type Address } from "wagmi";
import { ethers } from "ethers";

export const WALLET_CONNECT_ID = "5abe71d647514f366ddc98f3124f0d02";

export const APP_NAME = "Epic Bounties";
export const ZERO_STRING = "0";
export const ZERO_BIG_NUMBER = ethers.utils.parseEther(ZERO_STRING);

export const I_APP_GET_NONCE =
  "function getNonce(address _user) external view returns (uint256)";
export const I_APP_GET_BOUNTY =
  "function getBounty(address _user, uint256 _nonce) external view returns (bytes32, bytes32, uint256, uint256, uint256, uint256, int96, address)";
export const I_APP_OPEN_BOUNTY =
  "function openBounty(address _superToken, uint96 _amount, uint96 _amountMinimum, uint96 _durationHold, uint96 _durationFlow) external";
export const I_APP_AWARD_BOUNTY =
  "function awardBounty(uint256 _nonce, address _awardee) external";
export const I_APP_CANCEL_BOUNTY =
  "function cancelBounty(uint256 _nonce) external";
export const I_APP_DEPOSIT_GEL_FUNDS =
  "function depositGelatoFunds() external payable";
export const I_APP_WITHDRAW_GEL_FUNDS =
  "function withdrawGelatoFunds(uint256 _amount) external";
export const I_APP_WITHDRAW_SUPERTOKEN =
  "function withdrawSuperToken(address _superToken, uint256 _amount) external";
export const I_APP_MIN_DEPOSIT_AMOUNT =
  "function getMinimumDepositAmount() external view returns (uint96)";
export const I_APP_MIN_FLOW_AMOUNT =
  "function getMinimumFlowAmount() external view returns (uint96)";
export const I_APP_MAX_FLOW_DURATION_PER_UNIT_FLOW_AMOUNT =
  "function getMaxFlowDurationPerUnitFlowAmount() external view returns (uint96)";
export const I_APP_ST_BUFFER_DURATION_IN_SECOND =
  "function getSTBufferDurationInSecond() external view returns (uint256)";
export const I_APP_IS_ST_SUPPORTED =
  "function isSuperTokensSupported(address _superToken) external view returns (bool)";
export const I_APP_MIN_GELATO_TREASURY_BALANCE =
  "function getMinContractGelatoBalance() external view returns (uint256)";
export const I_APP_GET_ROLE =
  "function getRole(string memory _role) external pure returns (bytes32)";
export const I_APP_HAS_ROLE =
  "function hasRole(bytes32 _role, address _account) external view returns (bool)";
export const I_SYMBOL =
  "function symbol() external view returns (string memory)";
export const I_BALANCE_OF =
  "function balanceOf(address _account) public view returns (uint256)";
export const I_TRANSFER =
  "function transfer(address _to, uint256 _amount) public returns (bool)";
export const I_APPROVE =
  "function approve(address _spender, uint256 _amount) public returns (bool)";
export const I_ALLOWANCE =
  "function allowance(address _account, address _spender) public view returns (uint256)";
export const I_GELATO_TREASURY_BALANCE =
  "function userTokenBalance(address _user, address _fee) external view returns (uint256)";
export const I_SF_CFAV1_BUFFER_REQUIRED_FOR_FLOW_RATE =
  "function getDepositRequiredForFlowRate(address _token, int96 _flowRate) external view returns (uint256)";
export const I_SF_CFAV1_NET_FLOW =
  "function getNetFlow(address _token, address _account) external view override returns (int96)";

export const ADDRESS_GELATO_FEE = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

export const NETWORK_CONFIG_DEFAULT: NETWORK_CONFIG = {
  addrApp: "0x464F6e309B8dc57696d1Ad563FaE84DfE54F82A9", // TODO: thsi is TMP !! replace with real one !!!
  addrUSDC: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  addrUSDCx: "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
  addrSFHost: "0x3E14dC1b13c488a8d5D310918780c983bD5982E7",
  addrSFCFAV1: "0x6EeE6060f715257b970700bc2656De21dEdF074C",
  addrGelOps: "0x527a819db1eb0e34426297b03bae11F2f8B3A19E", // automation contract
  addrGelTreasury: "0x32DC6700AC87f6300277a63b0A4fDf132A8392bd",
  subgraphURLSF:
    "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-matic",
  alchemyNameHelper: "polygon-mainnet",
};
export const NETWORK_CONFIGS: { [x: number]: NETWORK_CONFIG } = {
  [polygon.id]: NETWORK_CONFIG_DEFAULT,
  [polygonMumbai.id]: {
    addrApp: "0x0b24843F4360633ff783173369Fc60D02137ccBa", // 0x87a759C45C65a568e626c9Fd83EFDa046d297828
    addrUSDC: "0xbe49ac1EadAc65dccf204D4Df81d650B50122aB2",
    addrUSDCx: "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7",
    addrSFHost: "0xEB796bdb90fFA0f28255275e16936D25d3418603",
    addrSFCFAV1: "0x49e565Ed1bdc17F3d220f72DF0857C26FA83F873",
    addrGelOps: "0xB3f5503f93d5Ef84b06993a1975B9D21B962892F", // automation contract
    addrGelTreasury: "0x527a819db1eb0e34426297b03bae11F2f8B3A19E",
    subgraphURLSF:
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai",
    alchemyNameHelper: "polygon-mumbai",
  },
  //   [mainnet.id]: {
  //     addrApp: "0x...",
  //     addrUSDC: "0x...",
  //     addrUSDCx: "0x...",
  //     addrSFHost: "0x...",
  //     addrSFCFAV1: "0x...",
  //     addrGelOps: "0x...", // automation contract
  //     addrGelTreasury: "0x...",
  //     subgraphURLSF:
  //       "https://subgraph.satsuma-prod.com/c5br3jaVlJI6/superfluid/eth-mainnet/api",
  //     alchemyNameHelper: "eth-mainnet",
  //   },
};

// types/interfaces

export type NETWORK_CONFIG = {
  addrApp: Address;
  addrUSDC: Address;
  addrUSDCx: Address;
  addrSFHost: Address;
  addrSFCFAV1: Address;
  addrGelOps: Address;
  addrGelTreasury: Address;
  subgraphURLSF: string;
  alchemyNameHelper: string;
};
