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


export class CreateDoctor {
  static async createDoctor(data: any) {
      const mail = new dynamicMailer();
      try {
          const id = uuidv4();
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
              Logger.info(`Incoming Data*********${data.toString()}`);
              const result = await contract.submitTransaction('createDoctor', id, JSON.stringify(data.data));
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

export class CreatePatient {
  static async createPatient(data: any) {
    //   console.log('From CreatePatient api');
    //   console.log('Data = '+data);
      
      
      const mail = new dynamicMailer();
      console.log('Mail = '+mail);
      
      try {
          const id = uuidv4();
          console.log('id = '+id);
          
          const wallet = new FileSystemWallet(walletPath);
        //   console.log('Wallet = '+JSON.stringify(wallet));
          
          const user = await wallet.exists('admin');
        //   console.log('User = '+user);
          
          if (!user) {
              return { status: status_code.NOTFOUND, message: l10n.t('NOT_FOUND', { key: 'Admin wallet' }) };
          }

          const gateway = new Gateway();
          try {
              await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });
              const network = await gateway.getNetwork(channelName);
              const contract = network.getContract(chaincodeName);
              Logger.info(`Incoming Data*********${data.toString()}`);

              const result = await contract.submitTransaction('createPatient', id, JSON.stringify(data.data));
            //   console.log('Result = '+result);
              
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
