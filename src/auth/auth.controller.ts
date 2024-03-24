import { Body, Controller, Get, Inject, Logger, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICES } from 'src/config';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger('client-auth.controller.ts');

  constructor(@Inject(NATS_SERVICES) private readonly client: ClientProxy) {}

  @Post('register-user')
  async registerUser(@Body() registerUserDto: RegisterDto) {
    const register = this.client.send('auth.register.user', registerUserDto);
    return register;
  }

  @Post('login-user')
  loginUser(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    const login = this.client.send('auth.login.user', loginDto);
    return login;
  }

  @Get('verify-user')
  verifyToken() {
    const verify = this.client.send('auth.verify.user', {});
    return verify;
  }
}
