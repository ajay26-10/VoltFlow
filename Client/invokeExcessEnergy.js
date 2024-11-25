const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "storage",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokeExcessEnergy",
    "",
    "releaseStoredEnergy",
    "S-01",
    "C-01",
    "500",
    "60"
).then(result => {
    console.log(new TextDecoder().decode(result))
    console.log("Energy Sold to Consumer by Storage Provider.")
})