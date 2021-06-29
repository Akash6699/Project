import * as l10n from 'jm-ez-l10n';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileSystemWallet, Gateway } from 'fabric-network';
import Logger from '../../common/loaders/logger';
import status_code from '../../common/utils/StatusCodes';
import { dynamicMailer } from '../../common/services/dynamicMailer';
import config from '../../common/config';
const channelName = config.CHANNEL_NAME;
const chaincodeName = config.CHAINCODE_NAME;
const walletPath = path.join(__dirname, '../../../', 'wallet');
const ccpPath = path.resolve(__dirname,'../../../', 'hyperledger' , config.NETWORK_CONFIG);

export class GetUser {
    static async getUser(data: any) {
        const mail = new dynamicMailer();
        try {
            const wallet = new FileSystemWallet(walletPath);
            const user = await wallet.exists('admin');
            if (!user) {
                return { status: status_code.NOTFOUND, message: l10n.t('NOT_FOUND', { key: 'Admin wallet' }) };
            }

            const gateway = new Gateway();
            try {
                await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
                const network = await gateway.getNetwork(channelName);
                const contract = network.getContract(chaincodeName);
                let result : any = await contract.submitTransaction('getUser', data.userId );
                Logger.info(`transaction successful*********${result.toString()}`);

                if (result) {
                    result = JSON.parse(result.toString());
                    result.data = JSON.parse(result.data);

                    // if(result.diagnosis){
                    // if(result.diagnosis.length)
                    // result.diagnosis = JSON.parse(result.diagnosis);
                    // if(result.treatment.length)
                    // result.treatment = JSON.parse(result.treatment.toString());
                    // }
                    return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'Receipt' }), data:result };
                }
            } catch (error) {
                Logger.errorAndMail(error);
                if (error.endorsements[0].message.includes('exist')) {
                    return { status: status_code.NOTFOUND, message: l10n.t('NOT_FOUND', { key: 'Receipt' }), data: error.endorsements };
                }
                return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG'), data: error.endorsements };
            } finally {
                gateway.disconnect();
            }
        } catch (error) {
            Logger.errorAndMail(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }
}

export class GetDataByTx {
  static async getDataByTx(data: any) {
      const mail = new dynamicMailer();
      try {
          const wallet = new FileSystemWallet(walletPath);
          const systemUser = await wallet.exists('admin');
          if (!systemUser) {
              Logger.warn('An identity for the user "admin" does not exist in the wallet');
              Logger.warn('Run the registerUser.js application before retrying');
              return;
          }
          const gateway = new Gateway();

          try {
              await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
              const network = await gateway.getNetwork(channelName);
              const channel = network.getChannel();
              const result = await channel.queryTransaction(data.tx_id);
              Logger.info(`transaction successful*********${result.toString()}`);
              if (result) {
                  let data = result.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes[0];
                  delete data.is_delete;
                  let output = JSON.parse(data.value);
                  output.data = JSON.parse(output.data);
                  // return { status: 'success', data: output };
                  return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'Data' }), data:output };
              }
          } catch (error) {
              Logger.errorAndMail(error);
              if (error.endorsements[0].message.includes('exist')) {
                return { status: status_code.NOTFOUND, message: l10n.t('NOT_FOUND', { key: 'Data' }), data: error.endorsements };
            }
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG'), data: error.endorsements };
          } finally {
              gateway.disconnect();
          }

      } catch (error) {
          Logger.errorAndMail(error);
          // return { status: 'fail', msg: error };
          return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
      }
  }
}

