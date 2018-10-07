import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import '../App.css';
import 'bulma/css/bulma.css';
import { checkSubdomainOwner } from "../utils";
import { checkMetamask, initMetamask } from "../utils/metamask"
import io from 'socket.io-client';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const socket = io('http://10.7.15.73:4000');
socket.on('connect', e => console.log('connect'));
socket.on('disconnect', function(){});
const Metamask = window.web3;
const connections = [{user: 'mark'}, {user: 'moritz'}, {user: 'mp'}, {user: 'austin'}]

const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));

const emptyAddress = '0x0000000000000000000000000000000000000000';

const metaPrivateKey = "678357edcb53ef959dbc213b72dac0ba328b33c6e8cd7107d9d378ff3d41a3d7";
const metaPublicKey = "0x09ed291B95eAf94F8e4393b0BC9A7C7eDC85aC83";
const currentAccount = localStorage.metaPublicKey;
console.log(localStorage.metaPrivateKey);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ensDomain: '',
      ensFound: false,
      publicAddress: '',
      ensMessage: 'Enter a valid or unempty username',
      hasAccess: false,
      resolvedAddress: '',
      qrCodeData: '',
      viewQRCode: false,
      status: null,
      msg: '',
      socketId: null,
      viewSignInButton: true,
      loggedIn: false,
      phoneUid: 'blabla',
      myPublicAddress: '',
      metamaskAccount: '',
      senderPublicAddress: '',
      ethBalance: 0,
      gzeBalance: 0,
      viewSubscriptions: false,
      ensAddress: '',
      currentAccount: '',
    }
  }

  componentDidMount() {
    //metamask
    if (typeof Metamask !== 'undefined') {
      Metamask.eth.getAccounts((err, accounts) => {
        if (accounts.length !== 0) {
          console.log('ACCOUNTS: ', accounts[0])
          this.setState({metamaskAccount: accounts[0]});
        } else {
          return this.setState({metamaskAccount: false});
        }
      })
    }
    //transfer socket
    socket.on('transfer', function(e) { console.log(e) });
  };

  _checkENS = async (ensUsername) => {

    if (ensUsername.length === 0) {
      this.setState({ensFound: false, ensMessage: 'Enter a valid or unempty username'});
      return;
    }

    this.setState({ensDomain: ensUsername});

    const { ensDomain } = this.state;

    const addr = await checkSubdomainOwner(ensUsername, 'tenz-id');

    if (addr === emptyAddress) {
      this.setState({ensFound: false, ensMessage: 'Available for you!', resolvedAddress: addr});
    } else if(addr === currentAccount) {
      this.setState({ensFound: true, ensMessage: "It's your domain! Edit away!", resolvedAddress: addr});
    } else if (addr === "0x") {

    } else {
      this.setState({ensFound: true, ensMessage: "Unavailable username"});
      // this._checkBalances(addr);
    }
  };

  _sendTransaction = () => {
    console.log('SENDING');
    const {senderPublicAddress, amount, phoneUid} = this.state;
    socket.emit('sendNotification', { payload: { publicAddress: '0xa1b02d8c67b0fdcf4e379855868deb470e169cfb', amount: 0.0001 }}, phoneUid );
  }

  _createAccount = async () => {
    console.log(`SENDING: ${this.state.ensDomain}/${this.state.metamaskAccount}`);
    const res = await fetch(`http://localhost:4000/deploy/${this.state.metamaskAccount}/${this.state.ensDomain}`)
    console.log('RESPONSE: ', res)
  }

  render() {
    const { ensFound, ensDomain, metamaskAccount, ensMessage, qrCodeData, viewQRCode, viewSignInButton, status, loggedIn, myPublicAddress, ethBalance, viewSubscriptions } = this.state;
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
    // myPublicAddress && !ethBalance ? this._getEthAddress() : null;

    return (
      <div className="container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
        { viewSignInButton &&
        <div className="box" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: 500, width: 500}}>
          <h1 className="title is-3" style={{fontWeight: '700'}}>Personal Wallet</h1>
          <h3 className="title is-4">Access Accounts</h3>
          <div className="field has-addons">
            <p className="control">
              <a className="button is-medium is-fullwidth">
                <span className="icon is-small">
                  <img src="https://cdn.freebiesupply.com/logos/large/2x/metamask-logo-png-transparent.png"/>
                </span>
              </a>
            </p>
            <p className="control">
              { metamaskAccount ? <input style={{height: 45, width: 330}} onChange={ e => this.setState({metamaskAccount: e.target.value})} className="input" type="text" placeholder="Username" value={metamaskAccount}/>
                : <a className="button is-medium is-fullwidth" style={{backgroundColor: '#ff7700'}} onClick={() => window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn")}>
                  <span style={{width: 300}}>Download Metamask</span>
                </a>}
            </p>
          </div>
          <div className="field has-addons">
            <p className="control">
              <a className="button is-medium is-fullwidth">
                  <span className="icon is-small">
                    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI3MSIgaGVpZ2h0PSI0MyIgdmlld0JveD0iMCAwIDcxIDQzIj4KICAgIDxnIGZpbGw9IiMzQjk5RkMiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTM1LjQzOCAxNWwxNC42OTkgMTQuMDA3TDY0LjEgMTVsNi45IDcuMDAzTDUwLjEzNyA0MyAzNS40MzggMjlsLTE0LjM0IDE0TDAgMjIuMDAzIDYuOTY0IDE1IDIxLjEgMjkuMDA3eiIvPgogICAgICAgIDxwYXRoIGQ9Ik01OC41MTcgMTEuNjMyQzUyLjc5NyAzLjg3NyA0NS4xMjUgMCAzNS41IDBTMTguNDAyIDMuODc3IDEzLjA4MiAxMS42MzJsNi45NDEgNi42NjhjMy43Ni02LjUzMyA4LjkyLTkuOCAxNS40NzctOS44czExLjgxOCAzLjI2NyAxNS43ODMgOS44bDcuMjM0LTYuNjY4eiIvPgogICAgPC9nPgo8L3N2Zz4K" alt="WalletConnect"/>
                  </span>
              </a>
            </p>
            <p className="control">
              <a className="button is-link is-medium is-fullwidth" onClick={() => this.setState({viewQRCode: !viewQRCode, viewSignInButton: !viewSignInButton})}>
                <span style={{width: 300}}>Add WalletConnect account</span>
              </a>
            </p>
          </div>
          <div>
            <h1 className="title is-3">Recovery Network</h1>
            {connections.map((cnx, key) => {
              return (<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <p>{cnx.user}</p>
                <div style={{width: 5}}></div>
              </div>)
            })}
          </div>
        </div>}
        { viewQRCode && qrCodeData && <div style={{ backgroundColor: 'white', height: 400, width: 400, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',  }}>
          <QRCode
            size={300}
            fgColor="black"
            bgColor="white"
            value={"this.state.qrCodeData"}
          />
        </div>}
      </div>    );
  }
}

export default Login;

