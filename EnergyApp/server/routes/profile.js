let profile = {
    producer: {
        "cryptoPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/producer.energy.com", 
		"keyDirectoryPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/producer.energy.com/users/User1@producer.energy.com/msp/keystore/",
        "certPath":     "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/producer.energy.com/users/User1@producer.energy.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/producer.energy.com/peers/peer0.producer.energy.com/tls/ca.crt",
		"peerEndpoint": "localhost:7227",
		"peerHostAlias":  "peer0.producer.energy.com",
        "mspId": "ProducerMSP"
    },
    consumer: {
        "cryptoPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/consumer.energy.com", 
		"keyDirectoryPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/consumer.energy.com/users/User1@consumer.energy.com/msp/keystore/",
        "certPath":     "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/consumer.energy.com/users/User1@consumer.energy.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/consumer.energy.com/peers/peer0.consumer.energy.com/tls/ca.crt",
		"peerEndpoint": "localhost:9051",
		"peerHostAlias":  "peer0.consumer.energy.com",
        "mspId": "ConsumerMSP" 
    },
    regulator: {
        "cryptoPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/regulator.energy.com", 
		"keyDirectoryPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/regulator.energy.com/users/User1@regulator.energy.com/msp/keystore/",
        "certPath":     "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/regulator.energy.com/users/User1@regulator.energy.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/regulator.energy.com/peers/peer0.regulator.energy.com/tls/ca.crt",
		"peerEndpoint": "localhost:7044",
		"peerHostAlias":  "peer0.regulator.energy.com",
        "mspId": "RegulatorMSP"
    },
    storage: {
        "cryptoPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/storage.energy.com", 
		"keyDirectoryPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/storage.energy.com/users/User1@storage.energy.com/msp/keystore/",
        "certPath":     "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/storage.energy.com/users/User1@storage.energy.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/storage.energy.com/peers/peer0.storage.energy.com/tls/ca.crt",
		"peerEndpoint": "localhost:11020",
		"peerHostAlias":  "peer0.storage.energy.com",
        "mspId": "StorageMSP"
    },
    finance: {
        "cryptoPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/finance.energy.com", 
		"keyDirectoryPath": "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/finance.energy.com/users/User1@finance.energy.com/msp/keystore/",
        "certPath":     "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/finance.energy.com/users/User1@finance.energy.com/msp/signcerts/cert.pem",
		"tlsCertPath":  "../../Energy-Trading-Platform-Network/organizations/peerOrganizations/finance.energy.com/peers/peer0.finance.energy.com/tls/ca.crt",
		"peerEndpoint": "localhost:8181",
		"peerHostAlias":  "peer0.finance.energy.com",
        "mspId": "FinanceMSP"
    }
}
module.exports = { profile }