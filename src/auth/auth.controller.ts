import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NATS_SERVICES } from 'src/config';
import { LoginDto, RegisterDto } from './dto';
import { catchError } from 'rxjs';
import { AuthGuard } from './guards/auth/auth.guard';
import { GetToken, User } from './decorators';

@Controller('auth')
export class AuthController {
  private logger = new Logger('client-auth.controller.ts');

  constructor(@Inject(NATS_SERVICES) private readonly client: ClientProxy) {}

  @Post('register-user')
  async registerUser(@Body() registerUserDto: RegisterDto) {
    const register = this.client
      .send('auth.register.user', registerUserDto)
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
    return register;
  }

  @Post('login-user')
  @HttpCode(200)
  loginUser(@Body() loginDto: LoginDto) {
    console.log('llamando al nats', loginDto);
    const login = this.client.send('auth.login.user', loginDto).pipe(
      catchError((error) => {
        console.log('Error', error);
        throw new RpcException(error);
      }),
    );
    return login;
  }

  @UseGuards(AuthGuard)
  @Get('verify-user')
  async verifyToken(@User() user: any, @GetToken() token: string) {
    return { user, token };
  }
}
