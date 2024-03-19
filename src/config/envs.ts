import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  // PRODUCT_MICROSERVICE_HOST: string;
  // PRODUCT_MICROSERVICE_PORT: number;
  // ORDER_MICROSERVICE_HOST: string;
  // ORDER_MICROSERVICE_PORT: number;
  NATS_SERVERS: string[];
}

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    // PRODUCT_MICROSERVICE_HOST: joi.string().required(),
    // PRODUCT_MICROSERVICE_PORT: joi.number().required(),

    // ORDER_MICROSERVICE_HOST: joi.string().required(),
    // ORDER_MICROSERVICE_PORT: joi.number().required(),

    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  // productMicroservice: {
  //   host: envVars.PRODUCT_MICROSERVICE_HOST,
  //   port: envVars.PRODUCT_MICROSERVICE_PORT,
  // },
  // ordertMicroservice: {
  //   host: envVars.ORDER_MICROSERVICE_HOST,
  //   port: envVars.ORDER_MICROSERVICE_PORT,
  // },
  natsServers: envVars.NATS_SERVERS,
};
