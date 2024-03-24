import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICES } from 'src/config';
import { LoginDto, RegisterDto } from './dto';
import { catchError } from 'rxjs';

@Controller('auth')
export class AuthController {
  private logger = new Logger('client-auth.controller.ts');

  constructor(@Inject(NATS_SERVICES) private readonly client: ClientProxy) {}

  @Post('register-user')
  async registerUser(@Body() registerUserDto: RegisterDto) {
    // try {
    const register = this.client
      .send('auth.register.user', registerUserDto)
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
    return register;
    // } catch (error) {
    // console.log('entro en el catch');
    // return error;
    // }
  }

  @Post('login-user')
  @HttpCode(200)
  loginUser(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    const login = this.client.send('auth.login.user', loginDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
    return login;
  }

  @Get('verify-user')
  verifyToken() {
    const verify = this.client.send('auth.verify.user', {});
    return verify;
  }
}
