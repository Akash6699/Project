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

export class AddTreatment {
    static async addTreatment(data: any) {
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
                const result = await contract.submitTransaction('addTreatment', data.userId, JSON.stringify(data.data) );
                Logger.info(`transaction successful*********${result.toString()}`);

                if (result) {
                    return { status: status_code.OK, message: l10n.t('SUCCESS_CREATE', { key: 'Receipt' }), data: JSON.parse(result.toString()) };
                }
            } catch (error) {
                Logger.errorAndMail(error);
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

export class AddDiagnosis {
  static async addDiagnosis(data: any) {
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
              const result = await contract.submitTransaction('addDiagnosis', data.userId, JSON.stringify(data.data) );
              Logger.info(`transaction successful*********${result.toString()}`);

              if (result) {
                  return { status: status_code.OK, message: l10n.t('SUCCESS_CREATE', { key: 'Receipt' }), data: JSON.parse(result.toString()) };
              }
          } catch (error) {
              Logger.errorAndMail(error);
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
