import 'babel-polyfill';
import preact from 'preact';
import { promisify } from './promisify';
import Popover from './popover';
import ERC20Token from './erc20_token.js';
import blockies from 'ethereum-blockies';

import { stringifyBalance, toBN } from './util';

import '../node_modules/cleanslate/cleanslate.css';
import '../index.scss';

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
}

class AccountTracker {
  constructor(account, web3js) {
    this.callbacks = [];
    this.web3js = web3js;
    this.account = account;
    this.start();
  }

  on(callback) {
    this.callbacks.push(callback);
  }

  off() {
    this.callbacks = void 0;
    clearInterval(this.intervalId);
  }

  start() {
    let accounts = null
    this.intervalId = setInterval(async () => {
      let accounts = await this.getAccounts();
      if (accounts[0] !== this.account) {
        this.account = accounts[0];
        this.callbacks.forEach((func) => {
          func(this.account);
        })
      }
    }, 500);
  }

  getAccounts() {
    return promisify(this.web3js.eth.getAccounts)();
  }
}

export default class App extends preact.Component {
  constructor(props) {
    super(props);
    this.state = {
      alerts: [],
      token: (new ERC20Token(this.props.web3js, this.props.ERC20TokenContractAddress)),
      isOpen: false,
      symbol: '',
      wantsSendAmount: 0,
      isLoading: false,
      senderBalance: 0,
      errorReason: null
    }
  }

  async componentWillMount() {
    let networkId = await this.getNetworkID();
    if(!this.isCorrectNetwork(networkId)) {
      this.setState({ errorReason: 'wrong_network' })
    } else {
      let symbol = await this.state.token.getSymbol();
      this.setState({ symbol })
    }
  }

  async handleClick() {
    if(!this.state.isOpen) {
      this.setState({ isLoading: true })

      let accounts = await this.getAccounts();
      let account = accounts[0];
      let networkId = await this.getNetworkID();
      this.accountTracker = new AccountTracker(account, this.props.web3js);
      this.accountTracker.on(async (account) => {
        let senderBalance = await this.getStringifyBalanceOf(account);
        this.setState({ account, senderBalance, errorReason: (this.state.errorReason === 'account_locked' ? null : this.state.errorReason) })
      })

      if (!this.canAccessAccount(accounts) || !this.isCorrectNetwork(networkId)) {
        this.setState({ isOpen: true, isLoading: false, errorReason: (!this.canAccessAccount(accounts) ? 'account_locked' : 'wrong_network')})
        return
      }

      let senderBalance = await this.getStringifyBalanceOf(account);
      this.setState({ isOpen: true, account, senderBalance, isLoading: false })
    } else {
      this.closePopover()
    }
  }

  canAccessAccount(accounts) {
    if (!accounts[0]) {
      return false
    }
    return true
  }

  isCorrectNetwork(networkID) {
    if (networkID !== '3') { // Currently, only supoprts ropsten test network
      return false
    }
    return true
  }

  getAccounts() {
    return promisify(this.props.web3js.eth.getAccounts)();
  }

  getNetworkID() {
    return promisify(this.props.web3js.version.getNetwork)();
  }

  async getStringifyBalanceOf(account) {
    let decimals = await this.state.token.getDecimals();
    let senderBalance = await this.state.token.getBalanceOf(account);
    return stringifyBalance(senderBalance, decimals)
  }

  handlePopoverInputChange(e) {
    this.setState({ wantsSendAmount: e.target.value })
  }

  async handlePopoverSubmit() {
    this.setState({isLoading: true})
    let decimals = await this.state.token.getDecimals();
    try {
        await this.state.token.transfer(this.props.receiverAddress, toBN(this.state.wantsSendAmount, decimals))
      } catch(err) {
        console.error(err);
      } finally {
        this.setState({ wantsSendAmount: 0, isLoading: false, isOpen: false })
    }
  }

  closePopover() {
    this.setState({ isOpen: false })
    this.accountTracker.off();
  }

  render() {
    return (
      <div className="GiveawayButtonContainer cleanslate">
        <button className={
          "GiveawayButtonContainer__button" +
            (this.state.isOpen ? ' GiveawayButtonContainer__button--active' : '') +
            (this.state.isLoading ? ' GiveawayButtonContainer__button--loading' : '') +
            (this.state.errorReason ? ' GiveawayButtonContainer__button--failure' : '')
          } onClick={this.handleClick.bind(this)}>
          <Spinner />
            { this.state.errorReason ?
              <div class="GiveawayButtonContainer__title">ERROR</div> :
              <div class="GiveawayButtonContainer__title">
                give<span className="GiveawayButtonContainer__symbol">{this.state.symbol}</span>
              </div>
            }
        </button>
        {
          this.state.isOpen &&
          <Popover
            senderAddress={this.state.account}
            receiverAddress={this.props.receiverAddress}
            symbol={this.state.symbol}
            account={this.state.account}
            senderBalance={this.state.senderBalance.toString(10)}
            handleChange={this.handlePopoverInputChange.bind(this)}
            handleSubmit={this.handlePopoverSubmit.bind(this)}
            close={this.closePopover.bind(this)}
            errorReason={this.state.errorReason}
          />
        }
      </div>
    )
  }
}
