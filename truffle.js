module.exports = {
networks: {
  development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network idgas: 4612388 // Gas limit used for deploys
      gas: 4612388 // Gas limit used for deploys
    }/*,
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x6A34244c5F35C508C9Ac9Fc56Ae5b63eC21451Ce", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }*/
    }
};
