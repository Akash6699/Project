export CHANNEL_NAME=mychannel
export CHAINCODE_NAME=system-flows-finalss

# https://hyperledger-fabric.readthedocs.io/en/release-1.4/build_network.html#create-join-channel

peer chaincode install -n $CHAINCODE_NAME -v 1.0 -l node -p /opt/gopath/src/github.com/chaincode/system-flows/

peer chaincode instantiate -o orderer.example.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n $CHAINCODE_NAME -l node -v 1.0 -c '{"Args":["invoke"]}' -P "OR ('Org1MSP.peer','Org2MSP.peer')"
