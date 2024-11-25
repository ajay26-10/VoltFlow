const express = require("express");
const router = express.Router();
const { clientApplication } = require("./client");


router.post("/recordenergy", async (req, res) => {
    try {
      const { energyId, producer, energy, price } = req.body;
  
      let ManufacturerClient = new clientApplication();
  
      const result = await ManufacturerClient.submitTxn(
        "producer",
        "energychannel",
        "energy-contract",
        "EnergyTrade",
        "invokeTxn",
        "",
        "recordEnergy",
        energyId,
        producer,
        energy,
        price
      );
  
      res.status(201).json({
        success: true,
        message: "Energy recorded successfully!",
        data: { result },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Please check the Energy ID!",
        data: { error },
      });
    }
  });


router.post("/getenergy", async (req, res) => {
  try {
    const { energyId } = req.body;
    let producerClient = new clientApplication();
    let energy = await producerClient.submitTxn(
     "producer",
     "energychannel",
     "energy-contract",
     "EnergyTrade",
     "queryTxn",
      "",
      "getEnergy",
      energyId
    );
    const data = new TextDecoder().decode(energy);
    const value = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "Energy data read successfully!",
      data: { value },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Please check the Energy ID!",
      data: { error },
    });
  }
});

router.post("/listenergy", async (req, res) => {
    try {
      const { energyId } = req.body;
      let producerClient = new clientApplication();
      let energy = await producerClient.submitTxn(
       "producer",
       "energychannel",
       "energy-contract",
       "EnergyTrade",
       "invokeListEnergy",
        "",
        "listEnergyForSale",
        energyId
      );
      const data = new TextDecoder().decode(energy);
      const value = JSON.parse(data);
  
      res.status(200).json({
        success: true,
        message: "Energy Details for Sale : ",
        data: { value },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Please check the Energy ID!",
        data: { error },
      });
    }
  });

router.post("/purchaseenergy", async (req, res) => {
  try {
    const { energyId, consumerId } = req.body;

    let ManufacturerClient = new clientApplication();

    const result = await ManufacturerClient.submitTxn(
      "consumer",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokePurchaseEnergy",
      "",
      "purchaseEnergy",
      energyId,
      consumerId
    );

    res.status(201).json({
      success: true,
      message: "Energy purchased successfully by Consumer!",
      data: { result },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Please check the Energy ID!",
      data: { error },
    });
  }
});

router.post("/auditsale", async (req, res) => {
    try {
      const { energyId } = req.body;
      let regulatorClient = new clientApplication();
      let energy = await regulatorClient.submitTxn(
       "regulator",
        "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokeAuditSale",
        "",
        "auditSale",
        energyId
      );
      const data = new TextDecoder().decode(energy);
      const value = JSON.parse(data);
  
      res.status(200).json({
        success: true,
        message: "Energy data audited successfully!",
        data: { value },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Please check the Energy ID!",
        data: { error },
      });
    }
  });

  router.post("/energydetails", async (req, res) => {
    try {
      const { energyId } = req.body;
      let regulatorClient = new clientApplication();
      let energy = await regulatorClient.submitTxn(
       "regulator",
        "energychannel",
    "energy-contract",
    "EnergyTrade",
    "queryEnergyDetails",
        "",
        "getEnergyDetailsForAudit",
        energyId
      );
      const data = new TextDecoder().decode(energy);
      const value = JSON.parse(data);
  
      res.status(200).json({
        success: true,
        message: "Energy details: ",
        data: { value },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Please check the Energy ID!",
        data: { error },
      });
    }
  });

  router.post("/excessenergy", async (req, res) => {
    try {
      const { storageId, consumerId, energy, price } = req.body;
      let storageClient = new clientApplication();
      let energydet = await storageClient.submitTxn(
       "storage",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokeExcessEnergy",
        "",
        "releaseStoredEnergy",
        storageId,
        consumerId,
        energy,
        price
      );
      const data = new TextDecoder().decode(energydet);
      const value = JSON.parse(data);
  
      res.status(200).json({
        success: true,
        message: "Energy details sold to Consumer: ",
        data: { value },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Please check the input data!",
        data: { error },
      });
    }
  });

  router.post("/loanapproval", async (req, res) => {
    try {
      const { loanId, producerId, amount, interestRate, term } = req.body;
      let storageClient = new clientApplication();
      let energydet = await storageClient.submitTxn(
       "finance",
    "energychannel",
    "energy-contract",
    "EnergyTrade",
    "invokeLoan",
        "",
        "provideFinancialAssistance",
        loanId,
        producerId,
        amount,
        interestRate,
        term
      );
      const data = new TextDecoder().decode(energydet);
      const value = JSON.parse(data);
  
      res.status(200).json({
        success: true,
        message: "Loan Approved Successfully! ",
        data: { value },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Please check the input data!",
        data: { error },
      });
    }
  });


module.exports = router;