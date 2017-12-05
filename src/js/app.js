var AccountId;

App = {
 

  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Account.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var AccountArtifact = data;
      
     
      

      App.contracts.Account = TruffleContract(AccountArtifact);
     
      // Set the provider for our contract.
      App.contracts.Account.setProvider(App.web3Provider);

      // Use our contract to retieve and mark the adopted pets. //not sure about this
    //  return App.getBalances();
    });

    $.getJSON('ERC20.json', function(data){

      var ERC20Artifact = data;

      App.contracts.ERC20 = TruffleContract(ERC20Artifact);

      App.contracts.ERC20.setProvider(App.web3Provider);

    });

    return App.bindEvents();
  },

/*  bindEvents: function() {
    $(document).on('click', '#transferButton', App.handleTransfer);
  },*/
  bindEvents: function() {
     $(document).on('click', '#createAccount', App.handleAccountCreation);
     $(document).on('click','#logIn', App.handleLogin);
     $(document).on('click','#Approve', App.handleIssuanceApproval);
     
   },


 /*handleAccountCreation: function(){
   alert('Account Created!');
 },*/
 handleLogin: function(){
  event.preventDefault();

  var id = parseInt($('#CHAccIdentity').val());
  var pin = parseInt($('#CHAccPin').val());
  console.log(AccountId);
  var chikwamaAccInstance;
  
       App.contracts.Account.deployed().then(function(instance) {
         chikwamaAccInstance = instance;
  
      return chikwamaAccInstance.checkPin(id, pin);
       }).then(function(result) {
        var msg = result.toString();
        var length = msg.length;
        var type = msg.substring(length-1,length);

         if(length== 6) 
         {           
           if(parseInt(type) == 0){
           window.open("central_office.html","_self");
           AccountId = id;
          }
         };
         if(length==7)alert('Invalid id or pin');
           }).catch(function(err) {
         console.log(err.message);
       });

 },

   handleAccountCreation: function(){
     event.preventDefault();

    // var account = App.getAccount(thisId);
    var x =0;
     var id = parseInt($('#CHAccIdentity').val());
     var type = parseInt($('#CHAccType').val());
    var address = web3.eth.accounts[x];
     x++;
     var pin = parseInt($('#CHAccPin').val());
   

  console.log('Create Account' + id + ' pin ' + pin + ' Type ' + type+ 'Account Count' + x);

     var AccInstance;

     App.contracts.Account.deployed().then(function(instance) {
       AccInstance = instance;

       return AccInstance.createAccount( address, id, type, pin);
     }).then(function(result) {
       if(result)alert('Account Created!');
         }).catch(function(err) {
       console.log(err.message);
     });
   },

  handleIssuanceApproval: function(){
    event.preventDefault();

    var agentId = parseInt($('#CHAccIdentity').val());
    var allowance = parseInt($('#CHAccAllowance').val());
    var pin = parseInt($('#CHAccPin').val());

    console.log('Agent ID ' + agentId + ' Allowance '+ allowance + 'by' + AccountId);

    
        var ERC20Instance;
        
             App.contracts.ERC20.deployed().then(function(instance) {
               ERC20Instance = instance;
        
               return ERC20Instance.approveIssuance( agentId, allowance);
             }).then(function(result) {
               if(result)alert(agentId +'approved to issue ' + allowance);
                 }).catch(function(err) {
               console.log(err.message);
             });

    
        

  },

  handleTransfer: function() {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var tutorialTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;

        return tutorialTokenInstance.transfer(toAddress, amount, {from: account});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getBalances: function(adopters, account) {
    console.log('Getting balances...');

    var tutorialTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.TutorialToken.deployed().then(function(instance) {
        tutorialTokenInstance = instance;

        return tutorialTokenInstance.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];

        $('#TTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
