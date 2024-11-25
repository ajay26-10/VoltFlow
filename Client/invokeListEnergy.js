const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "producer",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokeListEnergy",
    "",
    "listEnergyForSale",
    "E-01"
).then(result => {
    console.log(new TextDecoder().decode(result))
    console.log("Energy Successfully Listed For Sale")
})