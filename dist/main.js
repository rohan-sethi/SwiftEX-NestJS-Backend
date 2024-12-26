"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv_1 = require("dotenv");
const common_1 = require("@nestjs/common");
(0, dotenv_1.config)();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true, rawBody: true });
    app.setGlobalPrefix('api/');
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    await app.listen(process.env.PORT, () => {
        console.log("app runnin at: http://localhost:3001");
    });
}
bootstrap();
//# sourceMappingURL=main.js.map