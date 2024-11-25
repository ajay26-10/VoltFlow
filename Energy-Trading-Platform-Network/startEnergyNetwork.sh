#!/bin/bash

echo "------------Register the ca admin for each organization—----------------"

docker compose -f docker/docker-compose-ca.yaml up -d
sleep 3

sudo chmod -R 777 organizations/

echo "------------Register and enroll the users for each organization—-----------"

chmod +x registerEnroll.sh

./registerEnroll.sh
sleep 3

echo "—-------------Build the infrastructure—-----------------"

docker compose -f docker/docker-compose-org.yaml up -d
sleep 3

echo "-------------Generate the genesis block—-------------------------------"

export FABRIC_CFG_PATH=${PWD}/config

export CHANNEL_NAME=energychannel

configtxgen -profile ChannelUsingRaft -outputBlock ${PWD}/channel-artifacts/${CHANNEL_NAME}.block -channelID $CHANNEL_NAME
sleep 2

echo "------ Create the application channel------"

export ORDERER_CA=${PWD}/organizations/ordererOrganizations/energy.com/orderers/orderer.energy.com/msp/tlscacerts/tlsca.energy.com-cert.pem

export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/energy.com/orderers/orderer.energy.com/tls/server.crt

export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/energy.com/orderers/orderer.energy.com/tls/server.key

osnadmin channel join --channelID $CHANNEL_NAME --config-block ${PWD}/channel-artifacts/$CHANNEL_NAME.block -o localhost:7053 --ca-file $ORDERER_CA --client-cert $ORDERER_ADMIN_TLS_SIGN_CERT --client-key $ORDERER_ADMIN_TLS_PRIVATE_KEY
sleep 2

osnadmin channel list -o localhost:7053 --ca-file $ORDERER_CA --client-cert $ORDERER_ADMIN_TLS_SIGN_CERT --client-key $ORDERER_ADMIN_TLS_PRIVATE_KEY
sleep 2

export FABRIC_CFG_PATH=${PWD}/peercfg
export CORE_PEER_LOCALMSPID=ProducerMSP
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/producer.energy.com/peers/peer0.producer.energy.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/producer.energy.com/users/Admin@producer.energy.com/msp
export CORE_PEER_ADDRESS=localhost:7227
export PRODUCER_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/producer.energy.com/peers/peer0.producer.energy.com/tls/ca.crt
export CONSUMER_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/consumer.energy.com/peers/peer0.consumer.energy.com/tls/ca.crt
export REGULATOR_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/regulator.energy.com/peers/peer0.regulator.energy.com/tls/ca.crt
export STORAGE_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/storage.energy.com/peers/peer0.storage.energy.com/tls/ca.crt
export FINANCE_PEER_TLSROOTCERT=${PWD}/organizations/peerOrganizations/finance.energy.com/peers/peer0.finance.energy.com/tls/ca.crt
sleep 2

echo "—---------------Join Producer peer to the channel—-------------"

echo ${FABRIC_CFG_PATH}
sleep 2
peer channel join -b ${PWD}/channel-artifacts/${CHANNEL_NAME}.block
sleep 3

echo "-----channel List----"
peer channel list

echo "—-------------Producer anchor peer update—-----------"

peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json

cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.ProducerMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.producer.energy.com","port": 7051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id ${CHANNEL_NAME} --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.energy.com --tls --cafile $ORDERER_CA
sleep 1

# echo "—---------------Join Producer peer1 to the channel—-------------"

# export CORE_PEER_LOCALMSPID=ProducerMSP 
# export CORE_PEER_ADDRESS=localhost:7297
# export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/producer.energy.com/peers/peer1.producer.energy.com/tls/ca.crt
# export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/producer.energy.com/users/Admin@producer.energy.com/msp

# echo ${FABRIC_CFG_PATH}
# sleep 2
# peer channel join -b ${PWD}/channel-artifacts/${CHANNEL_NAME}.block
# sleep 3

echo "-----channel List----"
peer channel list

echo "—---------------package chaincode—-------------"

peer lifecycle chaincode package energy-contract.tar.gz --path ${PWD}/../Chaincode/Energy-transfer/ --lang node --label energy-contract_1.0
sleep 1

echo "—---------------install chaincode in Producer peer—-------------"

peer lifecycle chaincode install energy-contract.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled
sleep 1

export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid energy-contract.tar.gz)

echo "—---------------Approve chaincode in producer peer—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com --channelID $CHANNEL_NAME --name energy-contract --version 1.0  --collections-config ../Chaincode/Energy-transfer/collection-pdc.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 2


export CORE_PEER_LOCALMSPID=ConsumerMSP 
export CORE_PEER_ADDRESS=localhost:9051 
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/consumer.energy.com/peers/peer0.consumer.energy.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/consumer.energy.com/users/Admin@consumer.energy.com/msp

echo "—---------------Join Consumer peer to the channel—-------------"

peer channel join -b ${PWD}/channel-artifacts/$CHANNEL_NAME.block
sleep 1
peer channel list

echo "—-------------Consumer anchor peer update—-----------"

peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json
cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.ConsumerMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.consumer.energy.com","port": 9051}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id $CHANNEL_NAME --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.energy.com --tls --cafile $ORDERER_CA
sleep 1

echo "—---------------install chaincode in Consumer peer—-------------"

peer lifecycle chaincode install energy-contract.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled
sleep 1
export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid energy-contract.tar.gz)

echo "—---------------Approve chaincode in Consumer peer—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com --channelID $CHANNEL_NAME --name energy-contract --version 1.0  --collections-config ../Chaincode/Energy-transfer/collection-pdc.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 1


export CORE_PEER_LOCALMSPID=RegulatorMSP 
export CORE_PEER_ADDRESS=localhost:7044
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/regulator.energy.com/peers/peer0.regulator.energy.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/regulator.energy.com/users/Admin@regulator.energy.com/msp

echo "—---------------Join regulator peer to the channel—-------------"

peer channel join -b ${PWD}/channel-artifacts/$CHANNEL_NAME.block
sleep 1
peer channel list

echo "—-------------Regulator anchor peer update—-----------"

peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json
cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.RegulatorMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.regulator.energy.com","port": 7044}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id $CHANNEL_NAME --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.energy.com --tls --cafile $ORDERER_CA
sleep 1

echo "—---------------install chaincode in regulator peer—-------------"

peer lifecycle chaincode install energy-contract.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled
sleep 1

export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid energy-contract.tar.gz)

echo "—---------------Approve chaincode in regulator peer—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com --channelID $CHANNEL_NAME --name energy-contract --version 1.0  --collections-config ../Chaincode/Energy-transfer/collection-pdc.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 1


export CORE_PEER_LOCALMSPID=StorageMSP 
export CORE_PEER_ADDRESS=localhost:11020
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/storage.energy.com/peers/peer0.storage.energy.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/storage.energy.com/users/Admin@storage.energy.com/msp

echo "—---------------Join Storage peer to the channel—-------------"

peer channel join -b ${PWD}/channel-artifacts/$CHANNEL_NAME.block
sleep 1
peer channel list

echo "—-------------Storage anchor peer update—-----------"

peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json
cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.StorageMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.storage.energy.com","port": 11020}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id $CHANNEL_NAME --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.energy.com --tls --cafile $ORDERER_CA
sleep 1

echo "—---------------install chaincode in storage peer—-------------"

peer lifecycle chaincode install energy-contract.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled
sleep 1

export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid energy-contract.tar.gz)

echo "—---------------Approve chaincode in storage peer—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com --channelID $CHANNEL_NAME --name energy-contract --version 1.0  --collections-config ../Chaincode/Energy-transfer/collection-pdc.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 1

export CORE_PEER_LOCALMSPID=FinanceMSP 
export CORE_PEER_ADDRESS=localhost:8181
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/finance.energy.com/peers/peer0.finance.energy.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/finance.energy.com/users/Admin@finance.energy.com/msp

echo "—---------------Join Finance peer to the channel—-------------"

peer channel join -b ${PWD}/channel-artifacts/$CHANNEL_NAME.block
sleep 1
peer channel list

echo "—-------------Finance anchor peer update—-----------"

peer channel fetch config ${PWD}/channel-artifacts/config_block.pb -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com -c $CHANNEL_NAME --tls --cafile $ORDERER_CA
sleep 1

cd channel-artifacts

configtxlator proto_decode --input config_block.pb --type common.Block --output config_block.json
jq '.data.data[0].payload.data.config' config_block.json > config.json
cp config.json config_copy.json

jq '.channel_group.groups.Application.groups.FinanceMSP.values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "peer0.finance.energy.com","port": 8181}]},"version": "0"}}' config_copy.json > modified_config.json

configtxlator proto_encode --input config.json --type common.Config --output config.pb
configtxlator proto_encode --input modified_config.json --type common.Config --output modified_config.pb
configtxlator compute_update --channel_id $CHANNEL_NAME --original config.pb --updated modified_config.pb --output config_update.pb

configtxlator proto_decode --input config_update.pb --type common.ConfigUpdate --output config_update.json
echo '{"payload":{"header":{"channel_header":{"channel_id":"'$CHANNEL_NAME'", "type":2}},"data":{"config_update":'$(cat config_update.json)'}}}' | jq . > config_update_in_envelope.json
configtxlator proto_encode --input config_update_in_envelope.json --type common.Envelope --output config_update_in_envelope.pb

cd ..

peer channel update -f ${PWD}/channel-artifacts/config_update_in_envelope.pb -c $CHANNEL_NAME -o localhost:7050  --ordererTLSHostnameOverride orderer.energy.com --tls --cafile $ORDERER_CA
sleep 1

peer channel getinfo -c $CHANNEL_NAME


echo "—---------------install chaincode in Finance peer—-------------"

peer lifecycle chaincode install energy-contract.tar.gz
sleep 3

peer lifecycle chaincode queryinstalled
sleep 1

export CC_PACKAGE_ID=$(peer lifecycle chaincode calculatepackageid energy-contract.tar.gz)

echo "—---------------Approve chaincode in Finance peer—-------------"

peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com --channelID $CHANNEL_NAME --name energy-contract --version 1.0  --collections-config ../Chaincode/Energy-transfer/collection-pdc.json --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile $ORDERER_CA --waitForEvent
sleep 1

echo "—---------------Commit chaincode in Finance peer—-------------"

peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name energy-contract --version 1.0 --sequence 1 --collections-config ../Chaincode/Energy-transfer/collection-pdc.json --tls --cafile $ORDERER_CA --output json

peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.energy.com --channelID $CHANNEL_NAME --name energy-contract --version 1.0 --sequence 1 --collections-config ../Chaincode/Energy-transfer/collection-pdc.json --tls --cafile $ORDERER_CA --peerAddresses localhost:7227 --tlsRootCertFiles $PRODUCER_PEER_TLSROOTCERT --peerAddresses localhost:9051 --tlsRootCertFiles $CONSUMER_PEER_TLSROOTCERT --peerAddresses localhost:7044 --tlsRootCertFiles $REGULATOR_PEER_TLSROOTCERT --peerAddresses localhost:11020 --tlsRootCertFiles $STORAGE_PEER_TLSROOTCERT --peerAddresses localhost:8181 --tlsRootCertFiles $FINANCE_PEER_TLSROOTCERT
sleep 1

peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name energy-contract --cafile $ORDERER_CA
