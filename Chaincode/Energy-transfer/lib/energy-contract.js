'use strict';

const { Contract } = require('fabric-contract-api');

class EnergyTrade extends Contract {

    _getMSPId(ctx) {
        return ctx.clientIdentity.getMSPID();
    }

    // Producer: Record energy production

    async recordEnergy(ctx, energyId, producer, energy, price) {
        if (this._getMSPId(ctx) !== 'ProducerMSP') {
            throw new Error('Permission denied: Only Producers can record energy production.');
        }
    
        const energyData = { energyId, producer, energy, price, status: 'Available' };
    
        // Store data in the public ledger
        await ctx.stub.putState(energyId, Buffer.from(JSON.stringify(energyData)));
    
        // Emit event for new energy production
        ctx.stub.setEvent('EnergyProduced', Buffer.from(JSON.stringify(energyData)));
        return energyData;
    }

    // Priducer: Get Energy Details
    async getEnergy(ctx, energyId) {
        if (this._getMSPId(ctx) !== 'ProducerMSP') {
            throw new Error('Permission denied: Only Producers can list energy for sale.');
        }
        const energyAsBytes = await ctx.stub.getState(energyId);
        if (!energyAsBytes || energyAsBytes.length === 0) {
            throw new Error(`Energy with ID ${energyId} does not exist`);
        }
    
        return JSON.parse(energyAsBytes.toString());
    }
    
    // // Producer: List energy for sale
    async listEnergyForSale(ctx, energyId) {
        if (this._getMSPId(ctx) !== 'ProducerMSP') {
            throw new Error('Permission denied: Only Producers can list energy for sale.');
        }
    
        const energyAsBytes = await ctx.stub.getState(energyId);
        if (!energyAsBytes || energyAsBytes.length === 0) {
            throw new Error(`${energyId} does not exist`);
        }
        const energy = JSON.parse(energyAsBytes.toString());
        energy.status = 'Listed';
    
        await ctx.stub.putState(energyId, Buffer.from(JSON.stringify(energy)));
        return energy;
    }
    
    
    

    // Consumer: Purchase energy from listed producers
    
    async purchaseEnergy(ctx, energyId, consumerId) {
        if (this._getMSPId(ctx) !== 'ConsumerMSP') {
            throw new Error('Permission denied: Only Consumers can purchase energy.');
        }
    
        const energyAsBytes = await ctx.stub.getState(energyId);
        if (!energyAsBytes || energyAsBytes.length === 0) {
            throw new Error(`${energyId} does not exist`);
        }
    
        const energy = JSON.parse(energyAsBytes.toString());
        if (energy.status !== 'Listed') {
            throw new Error(`Energy with ID ${energyId} is not available for purchase`);
        }
    
        // Update status to Sold and record consumer details
        energy.status = 'Sold';
        energy.consumerId = consumerId;
    
        // Store updated data back in the public ledger
        await ctx.stub.putState(energyId, Buffer.from(JSON.stringify(energy)));
    
        // Emit purchase event
        ctx.stub.setEvent('EnergyPurchased', Buffer.from(JSON.stringify(energy)));
        return energy;
    }
    

    

    // Regulator: Audit an energy sale
    async auditSale(ctx, energyId) {
        if (this._getMSPId(ctx) !== 'RegulatorMSP') {
            throw new Error('Permission denied: Only Regulators can audit sales.');
        }
    
        const energyAsBytes = await ctx.stub.getState(energyId);
        if (!energyAsBytes || energyAsBytes.length === 0) {
            throw new Error(`Energy with ID ${energyId} does not exist for audit`);
        }
    
        const energy = JSON.parse(energyAsBytes.toString());
    
        // Perform an audit and update audit status
        energy.auditStatus = 'Audited';
    
        // Save audit results in the public ledger
        await ctx.stub.putState(energyId, Buffer.from(JSON.stringify(energy)));
    
        return energy;
    }

    

    // Storage Provider: Sell excess energy stored from producers
    
    async releaseStoredEnergy(ctx, storageId, consumerId, energy, price) {
        if (this._getMSPId(ctx) !== 'StorageMSP') {
            throw new Error('Permission denied: Only Storage Providers can release stored energy.');
        }
    
        const storedEnergy = { storageId, consumerId, energy, price, status: 'Sold' };
    
        // Store the transaction in the public ledger
        await ctx.stub.putState(storageId, Buffer.from(JSON.stringify(storedEnergy)));
    
        // Emit event for released stored energy
        ctx.stub.setEvent('StoredEnergyReleased', Buffer.from(JSON.stringify(storedEnergy)));
        return storedEnergy;
    }
    

    // Financial Institution: Provide financial assistance to producers

    async provideFinancialAssistance(ctx, loanId, producerId, amount, interestRate, term) {
        if (this._getMSPId(ctx) !== 'FinanceMSP') {
            throw new Error('Permission denied: Only Financial Institutions can provide financial assistance.');
        }
    
        const loan = { loanId, producerId, amount, interestRate, term, status: 'Active' };
    
        // Store loan details in the public ledger
        await ctx.stub.putState(loanId, Buffer.from(JSON.stringify(loan)));
    
        // Emit event for financial assistance granted
        ctx.stub.setEvent('FinancialAssistanceGranted', Buffer.from(JSON.stringify(loan)));
        return loan;
    }
    
    // Regulator only: Get energy production details for auditing

    async getEnergyDetailsForAudit(ctx, energyId) {
        if (this._getMSPId(ctx) !== 'RegulatorMSP') {
            throw new Error('Permission denied: Only Regulators can access audit details.');
        }
    
        const energyAsBytes = await ctx.stub.getState(energyId);
        if (!energyAsBytes || energyAsBytes.length === 0) {
            throw new Error(`Energy with ID ${energyId} does not exist`);
        }
        return JSON.parse(energyAsBytes.toString());
    }
    
    
}

module.exports = EnergyTrade;
