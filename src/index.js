import preact from 'preact';
import App from './app';

// export init funciton to window object.
const init = () => {
  let stylesheet = document.createElement('link')
  stylesheet.href = 'https://rawgit.com/takashi/giveaway/master/dist/index.css';
  stylesheet.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(stylesheet)

  let web3js = undefined;
  if (typeof web3 !== undefined) {
    // Browser installs Metamask or Mist
    // Global web3.currentProvider object will be removed both Metamask and Mist.
    // https://github.com/ethereum/mist/releases/tag/v0.9.0
    // https://github.com/MetaMask/faq/blob/master/detecting_metamask.md#deprecation-of-global-web3js
    web3js = new Web3(web3.currentProvider);
  }

  let target = document.querySelector('#giveawayButton');
  const contractAddress = target.getAttribute('data-contract-address')
  const receiverAddress = target.getAttribute('data-receiver-address')

  preact.render(<App web3js={web3js}
                     ERC20TokenContractAddress={contractAddress}
                     receiverAddress={receiverAddress} />, target);
}

init();
