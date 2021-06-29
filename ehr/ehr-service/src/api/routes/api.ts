import { Router, Request, Response } from 'express';
import Logger from '../../common/loaders/logger';
import * as l10n from 'jm-ez-l10n';
import status_code from '../../common/utils/StatusCodes';
import { VALIDATE } from '../schema/validate';
import { CreateDoctor, CreatePatient } from '../interfaces/CreateUser';
import { GetUser, GetDataByTx } from '../interfaces/GetUser';
import { AddTreatment, AddDiagnosis } from '../interfaces/AddData';

const route = Router();

export default (app: Router) => {
    app.use('/api', route);
    route.post('/create-doctor', VALIDATE.CREATE_DOCTOR, createDoctor);
    route.post('/create-patient', VALIDATE.CREATE_PATIENT, createPatient);
    route.post('/get-user', VALIDATE.GET_USER, getUser);
    route.post('/add-treatment', VALIDATE.ADD_TREATMENT, addTreatment);
    route.post('/add-diagnosis', VALIDATE.ADD_DIAGNOSIS, addDiagnosis);
    route.post('/get-tx-data', VALIDATE.GET_TX_DATA, getTxData);
};

async function createDoctor(req: Request, res: Response) {
  const data = req.body;
  
  CreateDoctor.createDoctor(data)
  .then(response => {
      res.status(response.status).json(response);
  })
  .catch(e => {
      Logger.errorAndMail(e);
      res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
  });
}

async function createPatient(req: Request, res: Response) {
  const data = req.body;
//   console.log('From API.ts create patient ='+data);

  CreatePatient.createPatient(data)
  .then(response => {
      res.status(response.status).json(response);
  })
  .catch(e => {
      Logger.errorAndMail(e);
      res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
  });
}

async function getUser(req: Request, res: Response) {
    const data = req.body;
    GetUser.getUser(data)
    .then(response => {
        res.status(response.status).json(response);
    })
    .catch(e => {
        Logger.errorAndMail(e);
        res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
    });
}

async function addTreatment(req: Request, res: Response) {
  const data = req.body;
  AddTreatment.addTreatment(data)
  .then(response => {
      res.status(response.status).json(response);
  })
  .catch(e => {
      Logger.errorAndMail(e);
      res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
  });
}

async function addDiagnosis(req: Request, res: Response) {
  const data = req.body;
  AddDiagnosis.addDiagnosis(data)
  .then(response => {
      res.status(response.status).json(response);
  })
  .catch(e => {
      Logger.errorAndMail(e);
      res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
  });
}

async function getTxData(req: Request, res: Response) {
  const data = req.body;
  GetDataByTx.getDataByTx(data)
  .then(response => {
      res.status(response.status).json(response);
  })
  .catch(e => {
      Logger.errorAndMail(e);
      res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
  });
}

