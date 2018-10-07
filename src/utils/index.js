const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));
// const sha3 = require('sha3');

let factoryContract = null;
const factoryAbi = [{"constant":true,"inputs":[],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_subdomain","type":"string"},{"name":"_domain","type":"string"},{"name":"_topdomain","type":"string"}],"name":"subdomainOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_registry","type":"address"}],"name":"updateRegistry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_node","type":"bytes32"},{"name":"_owner","type":"address"}],"name":"transferDomainOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_domain","type":"string"},{"name":"_topdomain","type":"string"}],"name":"domainOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_subdomain","type":"string"},{"name":"_domain","type":"string"},{"name":"_topdomain","type":"string"}],"name":"subdomainTarget","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"registry","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"lockDomainOwnershipTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"transferContractOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_subdomain","type":"string"},{"name":"_domain","type":"string"},{"name":"_topdomain","type":"string"},{"name":"_owner","type":"address"},{"name":"_target","type":"address"}],"name":"newSubdomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"locked","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_resolver","type":"address"}],"name":"updateResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_registry","type":"address"},{"name":"_resolver","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"creator","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"subdomain","type":"string"},{"indexed":false,"name":"domain","type":"string"},{"indexed":false,"name":"topdomain","type":"string"}],"name":"SubdomainCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousRegistry","type":"address"},{"indexed":true,"name":"newRegistry","type":"address"}],"name":"RegistryUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousResolver","type":"address"},{"indexed":true,"name":"newResolver","type":"address"}],"name":"ResolverUpdated","type":"event"},{"anonymous":false,"inputs":[],"name":"DomainTransfersLocked","type":"event"}]


// Ropsten
const factoryAddress = "0x62d6C93DF120FCa09a08258f3a644B5059aa12f0";

// Mainnet
//factoryAddress: "0x21aa8d3eee8be2333ed180e9a5a8c0729c9b652c",

factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress);
let currentAccount = localStorage.metaPublicKey;

export const addressResolver = async (input) => {
  if (input.substring(0,2) === "0x"){
    if (!/^(0x)?[0-9a-f]{40}$/i.test(input)) {
      console.log("Invalid address");
      return "0x0000000000000000000000000000000000000000";
    } else if (/^(0x)?[0-9a-f]{40}$/.test(input) || /^(0x)?[0-9A-F]{40}$/.test(input)) {
      console.log("Valid address");
      return input;
    }
  } else {
    return await checkSubdomainOwner(input, 'tenz-id');
  }
}


export const initWeb3 = () => {
  if(typeof web3 !== 'undefined') {
    // web3 = new Web3(web3.currentProvider);
    console.log('[x] web3 object initialized.');
    // initContracts();
  } else {
    //no web3 instance available show a popup
  }
};

export const checkSubdomainOwner = async (subdomain, domain, topdomain) => {
  if (subdomain && domain) {
    try {
      return await factoryContract.methods.subdomainOwner(subdomain, domain, 'xyz').call();
    } catch(e) {
      return "Error connecting to subdomain provider";
    }
  } else {
    return "Enter both subdomain and domain"
  }
};

export const newSubdomain = (subdomain, domain, owner, target) => {
  factoryContract.methods.newSubdomain(
    subdomain, domain, owner, target).send(
    {
      gas: 150000,
      from: currentAccount
    },
    function(error, result){
      if(error){
        console.log('[x] Error during execution', error);
      } else {
        console.log('[x] Result', result);
      }
    }
  )
};
