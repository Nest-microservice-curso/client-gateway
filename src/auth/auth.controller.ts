import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICES } from 'src/config';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICES) private readonly client: ClientProxy) {}

  @Post('register-user')
  async registerUser(@Body() registerUserDto: any) {
    const register = this.client.send('auth.register.user', registerUserDto);
    return register;
  }

  @Post('login-user')
  loginUser(@Body() loginDto: any) {
    console.log(loginDto);
    const login = this.client.send('auth.login.user', loginDto);
    return login;
  }

  @Post('verify-user')
  verifyToken() {
    const verify = this.client.send('auth.verify.user', {});
    return verify;
  }
}
