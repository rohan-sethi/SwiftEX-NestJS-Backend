import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';
import { verifyJwtToken } from 'src/utils/jwtHandler';

@Injectable()
export class AwsServices {
  private readonly region: string;
  private readonly testPKKey: string;
  constructor() {
    this.region = process.env.AWS_REGION;
    this.testPKKey = 'test_crypto_pks';
  }

  async getAdminWallets() {
    const client = new SecretsManagerClient({ region: this.region });
    const secretName = process.env.AWS_SM_SEC_KEY;

    const { SecretString } = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
        VersionStage: 'AWSCURRENT',
      }),
    );

    const secretObj = JSON.parse(SecretString);
    const decrtyptedPkObj = verifyJwtToken(
      secretObj[this.testPKKey],
      process.env.AWS_JWT_SK_SECRET,
    );

    delete decrtyptedPkObj.iat
    return decrtyptedPkObj;
  }
}
