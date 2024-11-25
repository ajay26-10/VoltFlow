const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "consumer",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokePurchaseEnergy",
    "",
    "purchaseEnergy",
    "E-01",
    "C-01"
).then(result => {
    console.log(new TextDecoder().decode(result))
    console.log("Energy Successfully Purchased By Consumer.")
})