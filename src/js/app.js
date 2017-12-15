                      var web3 =  new Web3();
                      var global_keystore;
                      var addresses;

                      var accountAdd = '0x21eb60118c47c074ec5900f8efaf28eea82769ee';
                      var tokenManagerAdd = '0x2c4cd9eab0f0a42840ca35a3d4210642bbde88f1';
                      var fiatPeggedTokenAdd = '0xb6e032767faef8a7a697b6a98a5497d192454a25';
                      var exchangeAdd = '0x3b45c89e2e427e63243316fc5aa97d3c1589972c';


                      var accountabi = [
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "_id",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_type",
                                    "type": "uint8"
                                },
                                {
                                    "name": "_pin",
                                    "type": "uint256"
                                }
                            ],
                            "name": "createAccount",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "_id",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_pin",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_newPin",
                                    "type": "uint256"
                                }
                            ],
                            "name": "changePin",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [
                                {
                                    "name": "_id",
                                    "type": "uint256"
                                }
                            ],
                            "name": "getAddCount",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "uint256"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "_id",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_new",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_pin",
                                    "type": "uint256"
                                }
                            ],
                            "name": "changeCentralOffice",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "_id",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_seed",
                                    "type": "string"
                                }
                            ],
                            "name": "addSeed",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "constant": false,
                            "inputs": [
                                {
                                    "name": "_id",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_add",
                                    "type": "address"
                                }
                            ],
                            "name": "addAddress",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "bool"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [
                                {
                                    "name": "_id",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_pin",
                                    "type": "uint256"
                                }
                            ],
                            "name": "checkPin",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "bool"
                                },
                                {
                                    "name": "",
                                    "type": "uint256"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [],
                            "name": "accountCount",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "uint256"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "constant": true,
                            "inputs": [
                                {
                                    "name": "_id",
                                    "type": "uint256"
                                },
                                {
                                    "name": "_index",
                                    "type": "uint256"
                                }
                            ],
                            "name": "getAddresses",
                            "outputs": [
                                {
                                    "name": "",
                                    "type": "address"
                                }
                            ],
                            "payable": false,
                            "type": "function"
                        },
                        {
                            "anonymous": false,
                            "inputs": [
                                {
                                    "indexed": false,
                                    "name": "nationalId",
                                    "type": "uint256"
                                }
                            ],
                            "name": "CreateAccount",
                            "type": "event"
                        }
                    ]

                    var tokenManagerabi = [
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "contractBalance",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_newCentralOffice",
                            "type": "uint256"
                          },
                          {
                            "name": "_pin",
                            "type": "uint256"
                          }
                        ],
                        "name": "changeCentralOffice",
                        "outputs": [
                          {
                            "name": "",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "centralOffice",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "inputs": [
                          {
                            "name": "_accountContract",
                            "type": "address"
                          }
                        ],
                        "payable": false,
                        "type": "constructor"
                      },
                      {
                        "anonymous": false,
                        "inputs": [
                          {
                            "indexed": false,
                            "name": "newCentralOffice",
                            "type": "uint256"
                          }
                        ],
                        "name": "ChangedCentralOffice",
                        "type": "event"
                      },
                      {
                        "anonymous": false,
                        "inputs": [
                          {
                            "indexed": false,
                            "name": "created",
                            "type": "string"
                          }
                        ],
                        "name": "CentralOfficeCreated",
                        "type": "event"
                      }
                    ]

                    var fiatPeggedTokenabi = [
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "name",
                        "outputs": [
                          {
                            "name": "",
                            "type": "string"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_spender",
                            "type": "address"
                          },
                          {
                            "name": "_value",
                            "type": "uint256"
                          }
                        ],
                        "name": "approve",
                        "outputs": [
                          {
                            "name": "success",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "sizeOf",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [
                          {
                            "name": "_addr",
                            "type": "address"
                          }
                        ],
                        "name": "etherBalanceOf",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "totalSupply",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_from",
                            "type": "address"
                          },
                          {
                            "name": "_to",
                            "type": "address"
                          },
                          {
                            "name": "_value",
                            "type": "uint256"
                          }
                        ],
                        "name": "transferFrom",
                        "outputs": [
                          {
                            "name": "",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "decimals",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint8"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [
                          {
                            "name": "_add",
                            "type": "address"
                          }
                        ],
                        "name": "balanceOf",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_from",
                            "type": "address"
                          },
                          {
                            "name": "_value",
                            "type": "uint256"
                          }
                        ],
                        "name": "burnFrom",
                        "outputs": [
                          {
                            "name": "success",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_spender",
                            "type": "address"
                          },
                          {
                            "name": "_value",
                            "type": "uint256"
                          }
                        ],
                        "name": "approveIssuance",
                        "outputs": [
                          {
                            "name": "success",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "symbol",
                        "outputs": [
                          {
                            "name": "",
                            "type": "string"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_to",
                            "type": "address"
                          },
                          {
                            "name": "_value",
                            "type": "uint256"
                          }
                        ],
                        "name": "transfer",
                        "outputs": [],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "admin_addr",
                        "outputs": [
                          {
                            "name": "",
                            "type": "address"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_from",
                            "type": "address"
                          },
                          {
                            "name": "_to",
                            "type": "address"
                          },
                          {
                            "name": "_value",
                            "type": "uint256"
                          }
                        ],
                        "name": "issue",
                        "outputs": [
                          {
                            "name": "",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [
                          {
                            "name": "",
                            "type": "address"
                          },
                          {
                            "name": "",
                            "type": "address"
                          }
                        ],
                        "name": "allowance",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "inputs": [
                          {
                            "name": "tokenName",
                            "type": "string"
                          },
                          {
                            "name": "tokenSymbol",
                            "type": "string"
                          }
                        ],
                        "payable": false,
                        "type": "constructor"
                      },
                      {
                        "payable": true,
                        "type": "fallback"
                      },
                      {
                        "anonymous": false,
                        "inputs": [
                          {
                            "indexed": false,
                            "name": "from",
                            "type": "address"
                          },
                          {
                            "indexed": false,
                            "name": "to",
                            "type": "address"
                          },
                          {
                            "indexed": false,
                            "name": "value",
                            "type": "uint256"
                          }
                        ],
                        "name": "Transfer",
                        "type": "event"
                      },
                      {
                        "anonymous": false,
                        "inputs": [
                          {
                            "indexed": false,
                            "name": "from",
                            "type": "address"
                          },
                          {
                            "indexed": false,
                            "name": "value",
                            "type": "uint256"
                          }
                        ],
                        "name": "Burn",
                        "type": "event"
                      },
                      {
                        "anonymous": false,
                        "inputs": [
                          {
                            "indexed": false,
                            "name": "from",
                            "type": "address"
                          },
                          {
                            "indexed": false,
                            "name": "to",
                            "type": "address"
                          },
                          {
                            "indexed": false,
                            "name": "value",
                            "type": "uint256"
                          }
                        ],
                        "name": "Issue",
                        "type": "event"
                      },
                      {
                        "anonymous": false,
                        "inputs": [
                          {
                            "indexed": false,
                            "name": "",
                            "type": "address"
                          },
                          {
                            "indexed": false,
                            "name": "",
                            "type": "address"
                          },
                          {
                            "indexed": false,
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "name": "ApprovedToIssue",
                        "type": "event"
                      }
                    ]

                    var exchangeabi = [
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "sizeOf",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [
                          {
                            "name": "_addr",
                            "type": "address"
                          }
                        ],
                        "name": "etherBalanceOf",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [],
                        "name": "trade",
                        "outputs": [
                          {
                            "name": "trader",
                            "type": "address"
                          },
                          {
                            "name": "side",
                            "type": "bool"
                          },
                          {
                            "name": "price",
                            "type": "uint256"
                          },
                          {
                            "name": "tokens",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "name": "priceBook",
                        "outputs": [
                          {
                            "name": "trader",
                            "type": "address"
                          },
                          {
                            "name": "side",
                            "type": "bool"
                          },
                          {
                            "name": "price",
                            "type": "uint256"
                          },
                          {
                            "name": "tokens",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_side",
                            "type": "bool"
                          },
                          {
                            "name": "_price",
                            "type": "uint256"
                          }
                        ],
                        "name": "cancelTrade",
                        "outputs": [
                          {
                            "name": "",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_price",
                            "type": "uint256"
                          },
                          {
                            "name": "_tokens",
                            "type": "uint256"
                          }
                        ],
                        "name": "buy",
                        "outputs": [
                          {
                            "name": "success",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": false,
                        "inputs": [
                          {
                            "name": "_price",
                            "type": "uint256"
                          },
                          {
                            "name": "_tokens",
                            "type": "uint256"
                          }
                        ],
                        "name": "sell",
                        "outputs": [
                          {
                            "name": "success",
                            "type": "bool"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "constant": true,
                        "inputs": [
                          {
                            "name": "",
                            "type": "address"
                          }
                        ],
                        "name": "tradeBalance",
                        "outputs": [
                          {
                            "name": "",
                            "type": "uint256"
                          }
                        ],
                        "payable": false,
                        "type": "function"
                      },
                      {
                        "inputs": [
                          {
                            "name": "_fiatPeggedContract",
                            "type": "address"
                          }
                        ],
                        "payable": false,
                        "type": "constructor"
                      },
                      {
                        "payable": true,
                        "type": "fallback"
                      },
                      {
                        "anonymous": false,
                        "inputs": [
                          {
                            "indexed": false,
                            "name": "",
                            "type": "string"
                          }
                        ],
                        "name": "TradeResult",
                        "type": "event"
                      }
                    ]
                

                
                      function setWeb3Provider(keystore) {
                        var web3Provider = new HookedWeb3Provider({
                          host: "http://localhost:8545",
                          transaction_signer: keystore
                        });
                
                        web3.setProvider(web3Provider);
                      }
                
                      function newAddresses(password) {
                        /*
                        if (password == '') {
                          password = prompt('Enter password to retrieve addresses', 'Password');
                        }*/
                
                        var numAddr = 3
                
                        global_keystore.keyFromPassword(password, function(err, pwDerivedKey) {
                
                        global_keystore.generateNewAddress(pwDerivedKey, numAddr);
                
                        addresses = global_keystore.getAddresses();
                
                        document.getElementById('sendFrom').innerHTML = ''
                        for (var i=0; i<addresses.length; ++i) {
                          document.getElementById('sendFrom').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'

                        }
                
                        getBalances();
                      })
                      }
                
                      function getBalances() {
                        
                        addresses = global_keystore.getAddresses();
                        document.getElementById('addr').innerHTML = 'Retrieving addresses...'
                
                        async.map(addresses, web3.eth.getBalance, function(err, balances) {
                          async.map(addresses, web3.eth.getTransactionCount, function(err, nonces) {
                            document.getElementById('addr').innerHTML = ''
                            for (var i=0; i<addresses.length; ++i) {
                              document.getElementById('addr').innerHTML += '<div>' + addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')' + '</div>'
                            }
                          })
                        })
                
                      }
                
                      function setSeed() {
                        var password = "";
                
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

                      function setCookie()
                      {
                        
                          var seed = document.getElementById('seed').value;
                          document.cookie =  seed;
                          console.log(document.cookie);
                          setSeed();
                          window.open("indexLogin.html","_self");
                          

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
                
                        global_keystore.keyFromPassword(password, function(err, pwDerivedKey) {
                        var seed = global_keystore.getSeed(pwDerivedKey);
                        alert('Your seed is: "' + seed + '". Please write it down.');
                        });
                      }

                      function sendEth() {
                        
                        var fromAddr = document.getElementById('sendFrom').value
                        var toAddr = '"'+document.getElementById('sendTo').value+'"'
                        var valueEth = document.getElementById('sendValueAmount').value
                        var value = parseFloat(valueEth)*1.0e18
                        var gasPrice = 18000000000
                        var gas = 50000
                        web3.eth.sendTransaction({from: fromAddr, to: toAddr, value: value, gasPrice: gasPrice, gas: gas}, function (err, txhash) {
                          console.log('error: ' + err)
                          console.log('txhash: ' + txhash)
                        })
                      }

                      function deleteCookie()
                      {
                        document.cookie = "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      }

                      function populateAddresses()
                      {  
                            console.log(document.cookie);
                            document.getElementById('seed').value = document.cookie;                  
                            setSeed();                     

                      }
                

                      function login()
                      {
                        
                        var fromAddr = document.getElementById('sendFrom').value
                        var contractAddr = accountAdd
                        var abi = accountabi
                        var contract = web3.eth.contract(abi).at(contractAddr)
                        var functionName = 'checkPin'
                        var id = parseInt($('#CHAccIdentity').val());
                        var pin = parseInt($('#CHAccPin').val());
                        var args = [id,pin]
                        var valueEth = 0
                        var value = parseFloat(valueEth)*1.0e18
                        var gasPrice = 50000000000
                        var gas = 4541592
                        args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
                        var callback = function(err, txhash) {
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
                                    App.setAccountId(id);

                                    window.open("agentAccount.html", "_self");
                                };
                                if (parseInt(type) == 2) {
                                  App.setAccountId(id);

                                  window.open("userAccount.html", "_self");
                              };
                            };
                            if (length == 7) alert('Invalid id or pin');
                            
                        }
                        args.push(callback)
                        contract[functionName].apply(this, args)

                      }

                      $('.nav-item').click(function(){
                        var this_item = $(this).attr("data-item");
                        $('.content-item').hide();
                        $('.item-' + this_item).fadeIn();
                    });

                    function createAccount()
                    {
                      var fromAddr = document.getElementById('sendFrom').value
                      var contractAddr = accountAdd
                      var abi = accountabi
                      var contract = web3.eth.contract(abi).at(contractAddr)
                      var functionName = 'createAccount'
                      var id = document.getElementById('CHAccIdentity').value
                      var type = document.getElementById('CHAccType').value
                      var pin = document.getElementById('createPin').value
                      console.log(id+','+pin+','+type)
                      var args = JSON.parse('[' + id +','+ type +','+ pin + ']')
                      var valueEth = 0
                      var value = parseFloat(valueEth)*1.0e18
                      var gasPrice = 50000000000
                      var gas = 4541592
                      args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
                      var callback = function(err, txhash) {
                        console.log('error: ' + err)
                        console.log('txhash: ' + txhash)
                        if(txhash)
                        {alert('account created!')}
                      }
                      args.push(callback)
                      contract[functionName].apply(this, args)
                    }

                    function approveIssuance()
                    {
                      var fromAddr = document.getElementById('sendFrom').value
                      var contractAddr = fiatPeggedTokenAdd
                      var abi = fiatPeggedTokenabi
                      var contract = web3.eth.contract(abi).at(contractAddr)
                      var functionName = 'approveIssuance'
                      var add = document.getElementById('CHAccAddress').value
                      var amount = document.getElementById('CHAccAllowance').value
                      console.log(add+','+amount)
                      var args = JSON.parse('['+'"'+ add +'"'+','+ amount+ ']')
                      var valueEth = 0
                      var value = parseFloat(valueEth)*1.0e18
                      var gasPrice = 50000000000
                      var gas = 4541592
                      args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
                      var callback = function(err, txhash) {
                        console.log('error: ' + err)
                        console.log('txhash: ' + txhash)
                        if(txhash)
                        {alert('Issaunce allowance approved!')}
                      }
                      args.push(callback)
                      contract[functionName].apply(this, args)
                    }

                    function handleApprove()
                    {
                      var fromAddr = document.getElementById('sendFrom').value
                      var contractAddr = fiatPeggedTokenAdd
                      var abi = fiatPeggedTokenabi
                      var contract = web3.eth.contract(abi).at(contractAddr)
                      var functionName = 'approve'
                      var add = document.getElementById('agentAddress').value
                      var amount = document.getElementById('withdrawalAmount').value
                      console.log(add+','+amount)
                      var args = JSON.parse('['+'"'+ add +'"'+','+ amount+ ']')
                      var valueEth = 0
                      var value = parseFloat(valueEth)*1.0e18
                      var gasPrice = 50000000000
                      var gas = 4541592
                      args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
                      var callback = function(err, txhash) {
                        console.log('error: ' + err)
                        console.log('txhash: ' + txhash)
                        if(txhash)
                        {alert('withdrawal approved!')}
                      }
                      args.push(callback)
                      contract[functionName].apply(this, args)

                    }

                    function issueZAR()
                    {
                      var fromAddr = document.getElementById('sendFrom').value
                      var contractAddr = fiatPeggedTokenAdd
                      var abi = fiatPeggedTokenabi
                      var contract = web3.eth.contract(abi).at(contractAddr)
                      var functionName = 'issue'
                      var add = document.getElementById('issueAddress').value
                      var amount = document.getElementById('issueAmount').value
                      console.log(add+','+amount)
                      var args = JSON.parse('['+'"'+ add +'"'+','+ amount+ ']')
                      var valueEth = 0
                      var value = parseFloat(valueEth)*1.0e18
                      var gasPrice = 50000000000
                      var gas = 4541592
                      args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
                      var callback = function(err, txhash) {
                        console.log('error: ' + err)
                        console.log('txhash: ' + txhash)
                        if(txhash)
                        {alert('Issaunce succesful!')}
                      }
                      args.push(callback)
                      contract[functionName].apply(this, args)

                    }

                    function handleTransfer()
                    {
                      var fromAddr = document.getElementById('sendFrom').value
                      var contractAddr = fiatPeggedTokenAdd
                      var abi = fiatPeggedTokenabi
                      var contract = web3.eth.contract(abi).at(contractAddr)
                      var functionName = 'transfer'
                      var addTo = document.getElementById('sendiZarAddress').value
                      var amount = document.getElementById('sendiZarAmount').value
                      console.log(addTo +','+amount)
                      var args = JSON.parse('['+'"'+ addTo +'",'+ amount+ ']')
                      var valueEth = 0
                      var value = parseFloat(valueEth)*1.0e18
                      var gasPrice = 50000000000
                      var gas = 4541592
                      args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
                      var callback = function(err, txhash) {
                        console.log('error: ' + err)
                        console.log('txhash: ' + txhash)
                        if(txhash)
                        {alert('Transfer Successful!')}
                      }
                      args.push(callback)
                      contract[functionName].apply(this, args)
                    }

                    function handleTransferFrom()
                    {
                      var fromAddr = document.getElementById('sendFrom').value
                      var contractAddr = fiatPeggedTokenAdd
                      var abi = fiatPeggedTokenabi
                      var contract = web3.eth.contract(abi).at(contractAddr)
                      var functionName = 'transferFrom'
                      var addFrom = document.getElementById('transferFrom').value
                      var addTo = document.getElementById('transferTo').value
                      var amount = document.getElementById('transferAmount').value
                      console.log(addFrom+','+ addTo +','+amount)
                      var args = JSON.parse('['+'"'+ addFrom +'",'+'"'+ addTo +'"'+','+ amount+ ']')
                      var valueEth = 0
                      var value = parseFloat(valueEth)*1.0e18
                      var gasPrice = 50000000000
                      var gas = 4541592
                      args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
                      var callback = function(err, txhash) {
                        console.log('error: ' + err)
                        console.log('txhash: ' + txhash)
                        if(txhash)
                        {alert('Transfer Successful!')}
                      }
                      args.push(callback)
                      contract[functionName].apply(this, args)
                    }

                    function handleBurnFrom()
                    {
                      var fromAddr = document.getElementById('sendFrom').value
                      var contractAddr = fiatPeggedTokenAdd
                      var abi = fiatPeggedTokenabi
                      var contract = web3.eth.contract(abi).at(contractAddr)
                      var functionName = 'burnFrom'
                      var addFrom = document.getElementById('withdrawFrom').value
                      var amount = document.getElementById('withdrawAmount').value
                      console.log(addFrom+ ','+amount)
                      var args = JSON.parse('['+'"'+ addFrom +'",'+amount+ ']')
                      var valueEth = 0
                      var value = parseFloat(valueEth)*1.0e18
                      var gasPrice = 50000000000
                      var gas = 4541592
                      args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
                      var callback = function(err, txhash) {
                        console.log('error: ' + err)
                        console.log('txhash: ' + txhash)
                        if(txhash)
                        {alert('Withdrawal succcessful!')}
                      }
                      args.push(callback)
                      contract[functionName].apply(this, args)
                    }

                
            
                