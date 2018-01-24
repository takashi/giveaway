import preact from 'preact';

// TODO calc and reposition popover
// export const calcBounds = (el) => {
//   if (el === window) {
//     return {
//       x: 0,
//       y: 0,
//       x2: el.innerWidth,
//       y2: el.innerHeight,
//       w: el.innerWidth,
//       h: el.innerHeight,
//     }
//   }

//   const b = el.getBoundingClientRect()

//   return {
//     x: b.left,
//     y: b.top,
//     x2: b.right,
//     y2: b.bottom,
//     w: b.right - b.left,
//     h: b.bottom - b.top,
//   }
// }

const PopoverDetail = (props) => {
  const avatarURL = (seed) => {
    return blockies.create({ seed }).toDataURL()
  }

  return (
    <div className="GiveawayPopover__body">
      <div className="GiveawayPopover__sendAmount">
        <span className="GiveawayPopover__sendAmount__symbol">送る</span>
        <div className="GiveawayPopover__sendAmountGroup">
          <input
            type="number" className="GiveawayButtonContainer__input"
            placeholder={"送りたい" + props.symbol + "量を入力"}
            onChange={props.handleChange}
          />
          <button className="GiveawayButtonContainer__button" onClick={props.handleSubmit}>確認画面へ</button>
        </div>
      </div>
      <div className="GiveawayPopover__balance">
        <p>あなたは<span>{props.senderBalance}</span><span>{props.symbol}</span>所持しています</p>
      </div>
      <div className="GiveawayPopover__accounts">
        <div className="GiveawayPopover__accounts__yours">
          <img className="GiveawayPopover__accounts__avatar" src={avatarURL(props.senderAddress)} />
          <p className="GiveawayPopover__accounts__address">{props.senderAddress}</p>
        </div>
        <p>→</p>
        <div className="GiveawayPopover__accounts__theirs">
          <img className="GiveawayPopover__accounts__avatar" src={avatarURL(props.receiverAddress)} />
          <p className="GiveawayPopover__accounts__address">{props.receiverAddress}</p>
        </div>
      </div>
    </div>
  )
}

const PopoverFailureMessage = ({reason}) => {
  return (
    <div className="GiveawayPopover__body GiveawayPopover__body--failure">
      {
        reason === 'wrong_network' &&
        <p>誤ったネットワークに接続しています。現在はRopstenテストネットのみをサポートしています。</p>
      }
      {
        reason === 'account_locked' &&
        <p>アカウントにアクセスできません。MetaMaskのロックを解除してください。</p>
      }
    </div>
  );
}

export default class Popover extends preact.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside.bind(this))
    let senderAvatar = blockies.create({ seed: this.props.senderAddress }).toDataURL();
    let receiverAvatar = blockies.create({ seed: this.props.receiverAddress }).toDataURL();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside.bind(this))
  }

  handleClickOutside(e) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.close();
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  render() {
    return (
      <div className="GiveawayPopover" ref={this.setWrapperRef.bind(this)}>
        <svg className="GiveawayPopover__tip" width="14" height="5">
          <polygon className={"GiveawayPopover__tipShape" + (this.props.errorReason ? ' GiveawayPopover__tipShape--failure' : '')} points="0,7 7,0, 14,7"></polygon>
        </svg>

        {
          this.props.errorReason ?
          <PopoverFailureMessage reason={this.props.errorReason} /> :
          <PopoverDetail
            symbol={this.props.symbol}
            handleChange={this.props.handleChange}
            handleSubmit={this.props.handleSubmit}
            senderBalance={this.props.senderBalance}
            receiverAddress={this.props.receiverAddress}
            senderAddress={this.props.senderAddress}
          />
        }
      </div>
    );
  }
}