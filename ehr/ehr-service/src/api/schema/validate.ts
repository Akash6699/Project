import { celebrate, Joi } from 'celebrate';

const VALIDATE = {
    CREATE_RECEIPT: celebrate({
        body: Joi.object({
            appName: Joi.string().required(),
            data: Joi.object().required()
        })
    }),

    CREATE_DOCTOR: celebrate({
      body: Joi.object({
          data: Joi.object().required()
      })
    }),

    CREATE_PATIENT: celebrate({
      body: Joi.object({
          data: Joi.object().required()
      })
    }),

    GET_USER: celebrate({
        body: Joi.object({
            userId: Joi.string().required()
        })
    }),

    ADD_TREATMENT: celebrate({
      body: Joi.object({
        userId: Joi.string().required(),
        data: Joi.object().required()
      })
    }),

    ADD_DIAGNOSIS: celebrate({
      body: Joi.object({
        userId: Joi.string().required(),
        data: Joi.object().required()
      })
    }),

    GET_TX_DATA: celebrate({
      body: Joi.object({
        tx_id: Joi.string().required()
      })
    }),
}
export { VALIDATE };
