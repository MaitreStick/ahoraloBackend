import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { User } from './entities/user.entity';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthGoogleLoginDto } from './dto/login-google-user.dto';
import { OAuth2Client } from 'google-auth-library';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}


  async create( createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });

      await this.userRepository.save( user )
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
  
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
  
    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');
  
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
  
    try {
      // Establecer la variable de sesión
      await this.dataSource.query(
        `SELECT set_config('app.current_user_id', $1, true)`,
        [user.id.toString()],
      );
    } catch (error) {
      console.error('Failed to set user session:', error);
      throw new UnauthorizedException('Failed to set user session');
    }
  
    // Verificar que la variable se ha establecido
    const result = await this.dataSource.query(
      `SELECT current_setting('app.current_user_id', true)`,
    );
  
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }
  

  async checkAuthStatus( user: User ){
    
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }
  
  async signInGoogle(AuthGoogleLoginDto: AuthGoogleLoginDto) {
    const { token } = AuthGoogleLoginDto;
    const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    const user = await this.userRepository.findOne({
      where: { email }, 
      select: { email: true, password: true, id: true, fullName: true }});
    if (!user) {
      const newUserData = { email, fullName: name}
      const randomPassword = randomBytes(12).toString('hex');
      const newUser = this.userRepository.create({
        ...newUserData,
        password: bcrypt.hashSync(randomPassword, 10),
      });
      await this.userRepository.save(newUser);
      return {
        ...newUser,
        token: this.getJwtToken({ id: newUser.id }),
      };
    }
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  
  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token;

  }

  private handleDBErrors( error: any ): never {


    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );

    console.log(error)

    throw new InternalServerErrorException('Please check server logs');

  }


}