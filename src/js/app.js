var web3 = new Web3();
var otherWeb3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/U6Drdv2VjRg9skzl2KtU"));
var global_keystore;
var addresses;

var adminAdd = '0x36f512b81399130020af8f878a78d6f3c6e49dbc';
var accountAdd = '0xe6119229cCfAb47dB4d0831c2094bE1d3e8a71BA';
var tokenManagerAdd = '0xBed37c1b73FB92c8dc702c1E7DA506C49Feab6c0';
var fiatPeggedTokenAdd = '0xCEab736F17D471D8e4A882FB2FA3ed69B44B6843';
var exchangeAdd = '0xdCCD8278D62Ce01d354C9F952D5Ae9c1110CfB63';


var accountabi = [{"constant":false,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_pin","type":"uint256"},{"name":"_newPin","type":"uint256"}],"name":"changePin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_seed","type":"string"}],"name":"addSeed","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_new","type":"bytes32"},{"name":"_pin","type":"uint256"}],"name":"changeCentralOffice","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_seed","type":"string"}],"name":"checkSeed","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"bytes32"}],"name":"addCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_add","type":"address"}],"name":"addAddress","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_pin","type":"uint256"}],"name":"checkPin","outputs":[{"name":"","type":"bool"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_index","type":"uint256"}],"name":"getAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"accountCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_id","type":"bytes32"},{"name":"_type","type":"uint8"},{"name":"_pin","type":"uint256"}],"name":"createAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"nationalId","type":"bytes32"}],"name":"CreateAccount","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"bytes32"}],"name":"AddressAdded","type":"event"}]

var tokenManagerabi = [{"constant":true,"inputs":[],"name":"chikwamaCentralOffice","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"accID","type":"bytes32"},{"name":"_type","type":"uint8"},{"name":"_pin","type":"uint256"}],"name":"createCentralOffice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newCentralOffice","type":"bytes32"},{"name":"_pin","type":"uint256"}],"name":"changeCentralOffice","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"centralOffice","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_accountContract","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newCentralOffice","type":"bytes32"}],"name":"ChangedCentralOffice","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"created","type":"string"}],"name":"CentralOfficeCreated","type":"event"}]

var fiatPeggedTokenabi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sizeOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"etherBalanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_spender","type":"address"},{"name":"_approver","type":"address"}],"name":"allowanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approveIssuance","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"issue","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_add","type":"address"}],"name":"getBalanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin_addr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_approver","type":"address"},{"name":"_value","type":"uint256"}],"name":"setAllowance","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"address"},{"indexed":false,"name":"","type":"uint256"}],"name":"ApprovedToIssue","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]

var exchangeabi = [{"constant":true,"inputs":[],"name":"sizeOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"etherBalanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_side","type":"bool"},{"name":"_price","type":"uint256"}],"name":"cancelTrade","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"etherBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getOrderBook","outputs":[{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"},{"name":"_tokens","type":"uint256"}],"name":"buy","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_price","type":"uint256"},{"name":"_tokens","type":"uint256"}],"name":"sell","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tradeBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_fiatPeggedContract","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"string"},{"indexed":false,"name":"","type":"uint256"}],"name":"TradeResult","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"","type":"string"}],"name":"ExchangeResult","type":"event"}]


function setWeb3Provider(keystore) {
  var web3Provider = new HookedWeb3Provider({
    host:"https://rinkeby.infura.io/U6Drdv2VjRg9skzl2KtU",
    transaction_signer: keystore
  });

  web3.setProvider(web3Provider);
}

function newAddresses(password) {
  
  if (password == '') {
    password = prompt('Enter password to retrieve addresses', 'Password');
  }

  var numAddr = 1

  global_keystore.keyFromPassword(password, function (err, pwDerivedKey) {

    global_keystore.generateNewAddress(pwDerivedKey, numAddr);

    addresses = global_keystore.getAddresses();

    document.getElementById('sendFrom').innerHTML = ''
    for (var i = 0; i < addresses.length; ++i) {
      document.getElementById('sendFrom').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'

    }
    
    getBalances();
    getPrice();
    handleBalanceOf();
    handleAllowanceOf();
    
    
    
    
  })
}

function getSizeOf() {

  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = exchangeAdd
  var abi = exchangeabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'sizeOf'
  var args = JSON.parse('[]')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    loadOrderBook(txhash)
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}


function loadOrderBook(sizeOf) {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = exchangeAdd
  var abi = exchangeabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'getOrderBook'
  var bidRows = 2;
  var askRows = 2;
 
  for (var i = 0; i < sizeOf; ++i) {
    var args = JSON.parse('['+i+']')
    var valueEth = 0
    var value = parseFloat(valueEth) * 1.0e18
    var gasPrice = 50000000000
    var gas = 4541592
    args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
    var callback = function (err, txhash) {
      console.log('error: ' + err)
      console.log('txhash: ' + txhash)
      
      var bidTable = document.getElementById('bidTable');
      var askTable = document.getElementById('askTable');
      
      var cells = 0;
      var msg = txhash.toString()
      
      if (msg.indexOf("true")>=0 && askRows<=sizeOf) 
      {
          
          var newRow = askTable.insertRow(askRows);
          var cell = newRow.insertCell(cells);
          cells++;
          var trade = msg.substring(msg.indexOf(",")+1);
          var ethPrice = trade.substring(0,trade.indexOf(",")) / 1.0e18
          var amount = trade.substring(trade.indexOf(",",msg.indexOf(",")+1)+1,trade.indexOf(",",trade.indexOf(",",msg.indexOf(",")+1)+1))
          cell.innerHTML='<p style="color:green;">'+ethPrice+'</p>';
          cell = newRow.insertCell(cells);
          cell.innerHTML='<p style="color:green;">'+amount+'</p>';
          askRows++;          
      }
      
      if (msg.indexOf("false")>=0 && bidRows<=sizeOf) 
      { 
        var newRow = bidTable.insertRow(bidRows);
        var cell = newRow.insertCell(cells);
        cells++;
        var trade = msg.substring(msg.indexOf(",")+1);
        var ethPrice = trade.substring(0,trade.indexOf(",")) / 1.0e18
        var amount = trade.substring(trade.indexOf(",",msg.indexOf(",")+1)+1,trade.indexOf(",",trade.indexOf(",",msg.indexOf(",")+1)+1))
        cell.innerHTML='<p style="color:red;">'+ethPrice+'</p>';
        cell = newRow.insertCell(cells);
        cell.innerHTML='<p style="color:red;">'+amount+'</p>';
        bidRows++;
        
      }
     


    }
    args.push(callback)
    contract[functionName].apply(this, args)
  }

}

function getBalances() {

  addresses = global_keystore.getAddresses();
  document.getElementById('addr').innerHTML = 'Retrieving addresses...'

  async.map(addresses, web3.eth.getBalance, function (err, balances) {
    async.map(addresses, web3.eth.getTransactionCount, function (err, nonces) {
      
      for (var i = 0; i < addresses.length; ++i) {
        document.getElementById('addr').innerHTML += '<div>(Ether Balance: ' + (balances[i] / 1.0e18) + ' ETH, Transactions: ' + nonces[i] + ')' + '</div>'
      }
    })
  })

}

function handleBalanceOf()
{
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = fiatPeggedTokenAdd
  var abi = fiatPeggedTokenabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'getBalanceOf'
  var args = JSON.parse('["'+fromAddr+'"]')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    document.getElementById('addr').innerHTML = ''
    document.getElementById('addr').innerHTML += '(Pegged Token Balance: ' + txhash + ' mCPT)'+'<br>'
  }
  args.push(callback)
  contract[functionName].apply(this, args)  
}

function handleAllowanceOf()
{
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = fiatPeggedTokenAdd
  var abi = fiatPeggedTokenabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'allowanceOf'
  var args = JSON.parse('["'+fromAddr+'",'+'"'+adminAdd+'"'+']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    document.getElementById('addr').innerHTML += '(Pegged Token Issuance Allowance: ' + txhash + ' mCPT)'
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function setSeed() {
  var password = prompt('Enter Password to encrypt your seed', 'Password');

  lightwallet.keystore.createVault({
    password: password,
    seedPhrase: document.getElementById('seed').value,
    //random salt 
    hdPathString: "m/0'/0'/0'"
  }, function (err, ks) {

    global_keystore = ks


    newAddresses(password);
    setWeb3Provider(global_keystore);


  })
}

function setCookie() {

  var seed = document.getElementById('seed').value;
  document.cookie = seed;
  console.log(document.cookie);
  setSeed();
  window.open("indexLogin.html", "_self");


}

function newWallet() {
  var extraEntropy = "prompt('Please enter some random text','entropy')";
  var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);

  var infoString = 'Your new wallet seed is: "' + randomSeed +
    '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' +
    'Please enter a password to encrypt your seed while in the browser.'
  var password = prompt(infoString, 'Password');


  lightwallet.keystore.createVault({
    password: password,
    seedPhrase: randomSeed,
    //random salt 
    hdPathString: "m/0'/0'/0'"
  }, function (err, ks) {

    global_keystore = ks

    newAddresses(password);
    setWeb3Provider(global_keystore);
    getBalances();
  })
}

function showSeed() {
  var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');

  global_keystore.keyFromPassword(password, function (err, pwDerivedKey) {
    var seed = global_keystore.getSeed(pwDerivedKey);
    alert('Your seed is: "' + seed + '". Please write it down.');
  });
}

function sendEth() {

  var fromAddr = document.getElementById('sendFrom').value
  var toAddr = document.getElementById('sendTo').value
  var valueEth = document.getElementById('sendValueAmount').value
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 18000000000
  var gas = 50000
  web3.eth.sendTransaction({ from: fromAddr, to: toAddr, value: value, gasPrice: gasPrice, gas: gas }, function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
  })
}

function deleteCookie() {
  document.cookie = "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function populateAddresses() {
  console.log(document.cookie);
  document.getElementById('seed').value = document.cookie;
  setSeed();

}


function login() {

  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = accountAdd
  var abi = accountabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'checkPin'
  var id = parseInt($('#CHAccIdentity').val());
  var pin = parseInt($('#CHAccPin').val());
  var args = [id, pin]
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)

    var msg = txhash.toString();
    var length = msg.length;
    var type = msg.substring(length - 1, length);

    if (length == 6) {

      if (parseInt(type) == 0) {

        window.open("centralOffice.html", "_self");

      };

      if (parseInt(type) == 1) {

        window.open("agentAccount.html", "_self");
      };
      if (parseInt(type) == 2) {
        window.open("userAccount.html", "_self");
      };
    };
    if (length == 7) alert('Invalid id or pin');

  }
  args.push(callback)
  contract[functionName].apply(this, args)

}

$('.nav-item').click(function () {
  var this_item = $(this).attr("data-item");
  $('.content-item').hide();
  $('.item-' + this_item).fadeIn();
});

function createAccount() {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = accountAdd
  var abi = accountabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'createAccount'
  var id = document.getElementById('CHAccIdentity').value
  var type = document.getElementById('CHAccType').value
  var pin = document.getElementById('createPin').value
  console.log(id + ',' + pin + ',' + type)
  var args = JSON.parse('[' + id + ',' + type + ',' + pin + ']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    if (txhash) { alert('account created!') }
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function approveIssuance() {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = fiatPeggedTokenAdd
  var abi = fiatPeggedTokenabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'approveIssuance'
  var add = document.getElementById('CHAccAddress').value
  var amount = document.getElementById('CHAccAllowance').value
  console.log(add + ',' + amount)
  var args = JSON.parse('[' + '"' + add + '"' + ',' + amount + ']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    if (txhash) { alert('Issaunce allowance approved!') }
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function handleApprove() {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = fiatPeggedTokenAdd
  var abi = fiatPeggedTokenabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'approve'
  var add = document.getElementById('agentAddress').value
  var amount = document.getElementById('withdrawalAmount').value
  console.log(add + ',' + amount)
  var args = JSON.parse('[' + '"' + add + '"' + ',' + amount + ']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    if (txhash) { alert('withdrawal approved!') }
  }
  args.push(callback)
  contract[functionName].apply(this, args)

}

function issueZAR() {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = fiatPeggedTokenAdd
  var abi = fiatPeggedTokenabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'issue'
  var add = document.getElementById('issueAddress').value
  var amount = document.getElementById('issueAmount').value
  console.log(add + ',' + amount)
  var args = JSON.parse('[' + '"' + add + '"' + ',' + amount + ']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    if (txhash) { alert('Issaunce succesful!') }
  }
  args.push(callback)
  contract[functionName].apply(this, args)

}

function handleTransfer() {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = fiatPeggedTokenAdd
  var abi = fiatPeggedTokenabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'transfer'
  var addTo = document.getElementById('sendiZarAddress').value
  var amount = document.getElementById('sendiZarAmount').value
  console.log(addTo + ',' + amount)
  var args = JSON.parse('[' + '"' + addTo + '",' + amount + ']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    if (txhash) { alert('Transfer Successful!') }
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function handleTransferFrom() {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = fiatPeggedTokenAdd
  var abi = fiatPeggedTokenabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'transferFrom'
  var addFrom = document.getElementById('transferFrom').value
  var addTo = document.getElementById('transferTo').value
  var amount = document.getElementById('transferAmount').value
  console.log(addFrom + ',' + addTo + ',' + amount)
  var args = JSON.parse('[' + '"' + addFrom + '",' + '"' + addTo + '"' + ',' + amount + ']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    if (txhash) { alert('Transfer Successful!') }
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function handleBurnFrom() {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = fiatPeggedTokenAdd
  var abi = fiatPeggedTokenabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'burnFrom'
  var addFrom = document.getElementById('withdrawFrom').value
  var amount = document.getElementById('withdrawAmount').value
  console.log(addFrom + ',' + amount)
  var args = JSON.parse('[' + '"' + addFrom + '",' + amount + ']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    if (txhash) { alert('Withdrawal succcessful!') }
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function handleSell() {
  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = exchangeAdd
  var abi = exchangeabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'sell'
  var ethPrice = document.getElementById('sellPrice').value
  var price = parseFloat(ethPrice) * 1.0e18
  var amount = document.getElementById('sellAmount').value
  console.log('selling: ' + amount + ' ,at ' + price +'ETH')
  var args = JSON.parse('[' + price + ',' + amount + ']')
  var valueEth = 0
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    if (txhash) { alert('order succcessful!') }
    xhr.open("GET", "https://api.etherscan.io/api?module=transaction&action=getstatus&txhash="+txhash+"&apikey=XH6VK5AGH3CV4HHW8APR7WGP1BSJSYZPUZ", false);
    xhr.send();
    console.log(xhr.status);
    console.log(xhr.statusText);
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function handleBuy() {

  var fromAddr = document.getElementById('sendFrom').value
  var contractAddr = exchangeAdd
  var abi = exchangeabi
  var contract = web3.eth.contract(abi).at(contractAddr)
  var functionName = 'buy'
  var ethPrice = document.getElementById('buyPrice').value
  var price = parseFloat(ethPrice) * 1.0e18
  var amount = document.getElementById('buyAmount').value
  console.log('buying: ' + amount + ' ,at ' + ethPrice +'ETH')
  var args = JSON.parse('[' + price + ',' + amount + ']')
  var valueEth = (amount * ethPrice).toPrecision(5)
  var value = parseFloat(valueEth) * 1.0e18
  var gasPrice = 50000000000
  var gas = 4541592
  args.push({ from: fromAddr, value: value, gasPrice: gasPrice, gas: gas })
  var callback = function (err, txhash) {
    console.log('error: ' + err)
    console.log('txhash: ' + txhash)
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.etherscan.io/api?module=transaction&action=getstatus&txhash="+txhash+"&apikey=XH6VK5AGH3CV4HHW8APR7WGP1BSJSYZPUZ", false);
    xhr.send();
    console.log(xhr.status);
    console.log(xhr.statusText);
    if (txhash) { alert('order succcessful!') }
  }
  args.push(callback)
  contract[functionName].apply(this, args)
}

function buyFunds(){
  value1 = parseFloat(document.getElementById("buyAmount").value);
  value2 = parseFloat(document.getElementById("buyPrice").value);
     if(!value1==""&&!value2=="")
     {
      sum = value1 * value2;
      document.getElementById("reqFunds").innerHTML = "";
      document.getElementById("reqFunds").innerHTML += sum +"ETH";
     }
}

function getPrice(){
  var xhr = new XMLHttpRequest();
  var price;
  xhr.open("GET", "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=XH6VK5AGH3CV4HHW8APR7WGP1BSJSYZPUZ",false);
  price =  xhr.responseText.substring(100,107);
  console.log(price);
  document.getElementById("price").innerHTML += price;
}




