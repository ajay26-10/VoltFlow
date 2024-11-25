const { clientApplication } = require('./client');

let userClient = new clientApplication();
userClient.submitTxn(
    "finance",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokeLoan",
    "",
    "provideFinancialAssistance",
    "L-01",
    "P-01",
    "10000000",
    "12",
    "10"
).then(result => {
    console.log(new TextDecoder().decode(result))
    console.log("Loan Successfully Approved for the Producer.")
})