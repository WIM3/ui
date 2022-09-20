/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface ERC20Interface extends utils.Interface {
  functions: {
    "MAX_UINT()": FunctionFragment;
    "_totalSupply()": FunctionFragment;
    "addBlackList(address)": FunctionFragment;
    "allowance(address,address)": FunctionFragment;
    "allowed(address,address)": FunctionFragment;
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "balances(address)": FunctionFragment;
    "basisPointsRate()": FunctionFragment;
    "decimals()": FunctionFragment;
    "deprecate(address)": FunctionFragment;
    "deprecated()": FunctionFragment;
    "destroyBlackFunds(address)": FunctionFragment;
    "getBlackListStatus(address)": FunctionFragment;
    "getOwner()": FunctionFragment;
    "isBlackListed(address)": FunctionFragment;
    "issue(uint256)": FunctionFragment;
    "maximumFee()": FunctionFragment;
    "name()": FunctionFragment;
    "owner()": FunctionFragment;
    "pause()": FunctionFragment;
    "paused()": FunctionFragment;
    "redeem(uint256)": FunctionFragment;
    "removeBlackList(address)": FunctionFragment;
    "setParams(uint256,uint256)": FunctionFragment;
    "symbol()": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "transfer(address,uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unpause()": FunctionFragment;
    "upgradedAddress()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "MAX_UINT"
      | "_totalSupply"
      | "addBlackList"
      | "allowance"
      | "allowed"
      | "approve"
      | "balanceOf"
      | "balances"
      | "basisPointsRate"
      | "decimals"
      | "deprecate"
      | "deprecated"
      | "destroyBlackFunds"
      | "getBlackListStatus"
      | "getOwner"
      | "isBlackListed"
      | "issue"
      | "maximumFee"
      | "name"
      | "owner"
      | "pause"
      | "paused"
      | "redeem"
      | "removeBlackList"
      | "setParams"
      | "symbol"
      | "totalSupply"
      | "transfer"
      | "transferFrom"
      | "transferOwnership"
      | "unpause"
      | "upgradedAddress"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "MAX_UINT", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "_totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addBlackList",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "allowance",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "allowed",
    values: [PromiseOrValue<string>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "balances",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "basisPointsRate",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "deprecate",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "deprecated",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "destroyBlackFunds",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBlackListStatus",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "getOwner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isBlackListed",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "issue",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "maximumFee",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(functionFragment: "paused", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "redeem",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "removeBlackList",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setParams",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transfer",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "upgradedAddress",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "MAX_UINT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "_totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addBlackList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "allowance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "allowed", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balances", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "basisPointsRate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deprecate", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deprecated", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "destroyBlackFunds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBlackListStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getOwner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isBlackListed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "issue", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maximumFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "paused", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "redeem", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removeBlackList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setParams", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "transfer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradedAddress",
    data: BytesLike
  ): Result;

  events: {
    "AddedBlackList(address)": EventFragment;
    "Approval(address,address,uint256)": EventFragment;
    "Deprecate(address)": EventFragment;
    "DestroyedBlackFunds(address,uint256)": EventFragment;
    "Issue(uint256)": EventFragment;
    "Params(uint256,uint256)": EventFragment;
    "Pause()": EventFragment;
    "Redeem(uint256)": EventFragment;
    "RemovedBlackList(address)": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
    "Unpause()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AddedBlackList"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deprecate"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DestroyedBlackFunds"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Issue"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Params"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Pause"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Redeem"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RemovedBlackList"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Unpause"): EventFragment;
}

export interface AddedBlackListEventObject {
  _user: string;
}
export type AddedBlackListEvent = TypedEvent<
  [string],
  AddedBlackListEventObject
>;

export type AddedBlackListEventFilter = TypedEventFilter<AddedBlackListEvent>;

export interface ApprovalEventObject {
  owner: string;
  spender: string;
  value: BigNumber;
}
export type ApprovalEvent = TypedEvent<
  [string, string, BigNumber],
  ApprovalEventObject
>;

export type ApprovalEventFilter = TypedEventFilter<ApprovalEvent>;

export interface DeprecateEventObject {
  newAddress: string;
}
export type DeprecateEvent = TypedEvent<[string], DeprecateEventObject>;

export type DeprecateEventFilter = TypedEventFilter<DeprecateEvent>;

export interface DestroyedBlackFundsEventObject {
  _blackListedUser: string;
  _balance: BigNumber;
}
export type DestroyedBlackFundsEvent = TypedEvent<
  [string, BigNumber],
  DestroyedBlackFundsEventObject
>;

export type DestroyedBlackFundsEventFilter =
  TypedEventFilter<DestroyedBlackFundsEvent>;

export interface IssueEventObject {
  amount: BigNumber;
}
export type IssueEvent = TypedEvent<[BigNumber], IssueEventObject>;

export type IssueEventFilter = TypedEventFilter<IssueEvent>;

export interface ParamsEventObject {
  feeBasisPoints: BigNumber;
  maxFee: BigNumber;
}
export type ParamsEvent = TypedEvent<[BigNumber, BigNumber], ParamsEventObject>;

export type ParamsEventFilter = TypedEventFilter<ParamsEvent>;

export interface PauseEventObject {}
export type PauseEvent = TypedEvent<[], PauseEventObject>;

export type PauseEventFilter = TypedEventFilter<PauseEvent>;

export interface RedeemEventObject {
  amount: BigNumber;
}
export type RedeemEvent = TypedEvent<[BigNumber], RedeemEventObject>;

export type RedeemEventFilter = TypedEventFilter<RedeemEvent>;

export interface RemovedBlackListEventObject {
  _user: string;
}
export type RemovedBlackListEvent = TypedEvent<
  [string],
  RemovedBlackListEventObject
>;

export type RemovedBlackListEventFilter =
  TypedEventFilter<RemovedBlackListEvent>;

export interface TransferEventObject {
  from: string;
  to: string;
  value: BigNumber;
}
export type TransferEvent = TypedEvent<
  [string, string, BigNumber],
  TransferEventObject
>;

export type TransferEventFilter = TypedEventFilter<TransferEvent>;

export interface UnpauseEventObject {}
export type UnpauseEvent = TypedEvent<[], UnpauseEventObject>;

export type UnpauseEventFilter = TypedEventFilter<UnpauseEvent>;

export interface ERC20 extends BaseContract {
  contractName: "ERC20";

  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ERC20Interface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    MAX_UINT(overrides?: CallOverrides): Promise<[BigNumber]>;

    _totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    addBlackList(
      _evilUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    allowance(
      _owner: PromiseOrValue<string>,
      _spender: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { remaining: BigNumber }>;

    allowed(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    approve(
      _spender: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    balanceOf(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balances(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    basisPointsRate(overrides?: CallOverrides): Promise<[BigNumber]>;

    decimals(overrides?: CallOverrides): Promise<[BigNumber]>;

    deprecate(
      _upgradedAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deprecated(overrides?: CallOverrides): Promise<[boolean]>;

    destroyBlackFunds(
      _blackListedUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getBlackListStatus(
      _maker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getOwner(overrides?: CallOverrides): Promise<[string]>;

    isBlackListed(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    issue(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    maximumFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    paused(overrides?: CallOverrides): Promise<[boolean]>;

    redeem(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    removeBlackList(
      _clearedUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setParams(
      newBasisPoints: PromiseOrValue<BigNumberish>,
      newMaxFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    transfer(
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferFrom(
      _from: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgradedAddress(overrides?: CallOverrides): Promise<[string]>;
  };

  MAX_UINT(overrides?: CallOverrides): Promise<BigNumber>;

  _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  addBlackList(
    _evilUser: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  allowance(
    _owner: PromiseOrValue<string>,
    _spender: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  allowed(
    arg0: PromiseOrValue<string>,
    arg1: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  approve(
    _spender: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  balanceOf(
    who: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balances(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

  decimals(overrides?: CallOverrides): Promise<BigNumber>;

  deprecate(
    _upgradedAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deprecated(overrides?: CallOverrides): Promise<boolean>;

  destroyBlackFunds(
    _blackListedUser: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getBlackListStatus(
    _maker: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getOwner(overrides?: CallOverrides): Promise<string>;

  isBlackListed(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  issue(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

  name(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  paused(overrides?: CallOverrides): Promise<boolean>;

  redeem(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  removeBlackList(
    _clearedUser: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setParams(
    newBasisPoints: PromiseOrValue<BigNumberish>,
    newMaxFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  symbol(overrides?: CallOverrides): Promise<string>;

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

  transfer(
    _to: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferFrom(
    _from: PromiseOrValue<string>,
    _to: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  upgradedAddress(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    MAX_UINT(overrides?: CallOverrides): Promise<BigNumber>;

    _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    addBlackList(
      _evilUser: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    allowance(
      _owner: PromiseOrValue<string>,
      _spender: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowed(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      _spender: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balances(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    deprecate(
      _upgradedAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    deprecated(overrides?: CallOverrides): Promise<boolean>;

    destroyBlackFunds(
      _blackListedUser: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getBlackListStatus(
      _maker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getOwner(overrides?: CallOverrides): Promise<string>;

    isBlackListed(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    issue(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    pause(overrides?: CallOverrides): Promise<void>;

    paused(overrides?: CallOverrides): Promise<boolean>;

    redeem(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    removeBlackList(
      _clearedUser: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setParams(
      newBasisPoints: PromiseOrValue<BigNumberish>,
      newMaxFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    symbol(overrides?: CallOverrides): Promise<string>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferFrom(
      _from: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;

    upgradedAddress(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "AddedBlackList(address)"(_user?: null): AddedBlackListEventFilter;
    AddedBlackList(_user?: null): AddedBlackListEventFilter;

    "Approval(address,address,uint256)"(
      owner?: PromiseOrValue<string> | null,
      spender?: PromiseOrValue<string> | null,
      value?: null
    ): ApprovalEventFilter;
    Approval(
      owner?: PromiseOrValue<string> | null,
      spender?: PromiseOrValue<string> | null,
      value?: null
    ): ApprovalEventFilter;

    "Deprecate(address)"(newAddress?: null): DeprecateEventFilter;
    Deprecate(newAddress?: null): DeprecateEventFilter;

    "DestroyedBlackFunds(address,uint256)"(
      _blackListedUser?: null,
      _balance?: null
    ): DestroyedBlackFundsEventFilter;
    DestroyedBlackFunds(
      _blackListedUser?: null,
      _balance?: null
    ): DestroyedBlackFundsEventFilter;

    "Issue(uint256)"(amount?: null): IssueEventFilter;
    Issue(amount?: null): IssueEventFilter;

    "Params(uint256,uint256)"(
      feeBasisPoints?: null,
      maxFee?: null
    ): ParamsEventFilter;
    Params(feeBasisPoints?: null, maxFee?: null): ParamsEventFilter;

    "Pause()"(): PauseEventFilter;
    Pause(): PauseEventFilter;

    "Redeem(uint256)"(amount?: null): RedeemEventFilter;
    Redeem(amount?: null): RedeemEventFilter;

    "RemovedBlackList(address)"(_user?: null): RemovedBlackListEventFilter;
    RemovedBlackList(_user?: null): RemovedBlackListEventFilter;

    "Transfer(address,address,uint256)"(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      value?: null
    ): TransferEventFilter;
    Transfer(
      from?: PromiseOrValue<string> | null,
      to?: PromiseOrValue<string> | null,
      value?: null
    ): TransferEventFilter;

    "Unpause()"(): UnpauseEventFilter;
    Unpause(): UnpauseEventFilter;
  };

  estimateGas: {
    MAX_UINT(overrides?: CallOverrides): Promise<BigNumber>;

    _totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    addBlackList(
      _evilUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    allowance(
      _owner: PromiseOrValue<string>,
      _spender: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    allowed(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    approve(
      _spender: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    balanceOf(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balances(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    basisPointsRate(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    deprecate(
      _upgradedAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deprecated(overrides?: CallOverrides): Promise<BigNumber>;

    destroyBlackFunds(
      _blackListedUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getBlackListStatus(
      _maker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getOwner(overrides?: CallOverrides): Promise<BigNumber>;

    isBlackListed(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    issue(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    maximumFee(overrides?: CallOverrides): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    paused(overrides?: CallOverrides): Promise<BigNumber>;

    redeem(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    removeBlackList(
      _clearedUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setParams(
      newBasisPoints: PromiseOrValue<BigNumberish>,
      newMaxFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>;

    transfer(
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferFrom(
      _from: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    upgradedAddress(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    MAX_UINT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    _totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addBlackList(
      _evilUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    allowance(
      _owner: PromiseOrValue<string>,
      _spender: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    allowed(
      arg0: PromiseOrValue<string>,
      arg1: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    approve(
      _spender: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      who: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balances(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    basisPointsRate(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    deprecate(
      _upgradedAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deprecated(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    destroyBlackFunds(
      _blackListedUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getBlackListStatus(
      _maker: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getOwner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isBlackListed(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    issue(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    maximumFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    paused(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    redeem(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    removeBlackList(
      _clearedUser: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setParams(
      newBasisPoints: PromiseOrValue<BigNumberish>,
      newMaxFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    transfer(
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferFrom(
      _from: PromiseOrValue<string>,
      _to: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    upgradedAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
