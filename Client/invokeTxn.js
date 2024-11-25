const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "producer",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokeTxn",
    "",
    "recordEnergy",
    "E-01",
    "P-01",
    "1000",
    "50"
).then(result => {
    console.log(new TextDecoder().decode(result))
    console.log("Vehicle successfully created")
}).catch(error => {
    console.error("Error creating vehicle:", error);

})