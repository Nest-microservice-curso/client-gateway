import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  @Get()
  HealthCheck() {
    return 'Client Gateway is up and running!';
  }
}
