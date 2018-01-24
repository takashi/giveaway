import ERC20ABI from 'human-standard-token-abi'
import { promisify } from './promisify';

export default class ERC20Token {
  constructor(web3, contractAddress) {
    this.web3 = web3;
    this.contractAddress = contractAddress;
    this.cachedToken = null;
  }

  async transfer(to, amount) {
    let token = await this.getCachedToken();
    return promisify(token.transfer)(to, amount);
  }

  async getBalanceOf(address) {
    let token = await this.getCachedToken();
    return promisify(token.balanceOf)(address);
  }

  async getDecimals() {
    let token = await this.getCachedToken();
    return promisify(token.decimals)();
  }

  async getSymbol() {
    let token = await this.getCachedToken();
    return promisify(token.symbol)();
  }

  getCachedToken() {
    if (this.cachedToken) {
      return this.cachedToken;
    } else {
      return this.token();
    }
  }

  token() {
    let contract = this.web3.eth.contract(ERC20ABI)

    // The Ishikawa Coin contract
    return promisify(contract.at, contract)(this.contractAddress);
  }
}
