const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "regulator",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokeAuditSale",
    "",
    "auditSale",
    "E-01"
).then(result => {
    console.log(new TextDecoder().decode(result))
    console.log("Energy Sale Successfully Audited by Regulator.")
})