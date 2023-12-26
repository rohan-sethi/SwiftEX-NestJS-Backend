"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsServices = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const common_1 = require("@nestjs/common");
const jwtHandler_1 = require("../utils/jwtHandler");
let AwsServices = class AwsServices {
    constructor() {
        this.region = process.env.AWS_REGION;
        this.testPKKey = 'test_crypto_pks';
    }
    async getAdminWallets() {
        const client = new client_secrets_manager_1.SecretsManagerClient({ region: this.region });
        const secretName = process.env.AWS_SM_SEC_KEY;
        const { SecretString } = await client.send(new client_secrets_manager_1.GetSecretValueCommand({
            SecretId: secretName,
            VersionStage: 'AWSCURRENT',
        }));
        const secretObj = JSON.parse(SecretString);
        const decrtyptedPkObj = (0, jwtHandler_1.verifyJwtToken)(secretObj[this.testPKKey], process.env.AWS_JWT_SK_SECRET);
        delete decrtyptedPkObj.iat;
        return decrtyptedPkObj;
    }
};
AwsServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AwsServices);
exports.AwsServices = AwsServices;
//# sourceMappingURL=aws.service.js.map