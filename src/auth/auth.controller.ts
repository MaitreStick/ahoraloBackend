import { Controller, Get, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser, Auth } from './decorators';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseLoginUser, ResponseRegisterUserAndCheckStatus } from './interfaces/Response';
import { AuthGoogleLoginDto } from './dto/login-google-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 200, description: 'User created successfully', type: ResponseRegisterUserAndCheckStatus })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  createUser(@Body() createUserDto: CreateUserDto ) {
    return this.authService.create( createUserDto );
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully', type: ResponseLoginUser })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Credential Not valid' })
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }

  @Get('check-status')
  @ApiOperation({ summary: 'Check user authentication status' })
  @ApiBearerAuth('JWT-auth')
  @Auth()
  @ApiResponse({ status: 200, description: 'User authentication status verified successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus( user );
  }


  @Post('validate-google-token')
  @ApiOperation({ summary: 'Validate Google token for login' })
  @ApiResponse({ status: 200, description: 'Google token validated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  googleLogin(@Body() body: AuthGoogleLoginDto) {
    return this.authService.signInGoogle(body);
  }
  
}