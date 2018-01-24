## giveaway


the browser widget that can send ERC20 standard token.

this widget requires Metamask or Mist wallet.

![image](https://user-images.githubusercontent.com/1506738/35369423-27697b06-01cb-11e8-9f25-1cd946e3f6f8.png)

### Usage

note: Currently, this widget only supports **ropsten test network**


Paste code below to your site location that you'd like to show this widget

```
<div id="giveawayButton"
  data-contract-address="ERC_20_CONTRACT_ADDRESS"
  data-receiver-address="TOKEN_RECEIVER_ADDRESS"
></div>
```

And paste below at just before `</body>`

```html
<script>
  js = document.createElement('script')
  js.src = 'https://rawgit.com/takashi/giveaway/master/dist/index.js';
  js.type = 'text/javascript';
  document.getElementsByTagName('head')[0]
    .appendChild(js)
</script>
```
