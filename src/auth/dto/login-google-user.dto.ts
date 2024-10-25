import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthGoogleLoginDto {

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    nullable: false,
    description: 'The Google authentication token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    example: 'janedoe@gmail.com',
    nullable: false,
    description: 'The email of the user',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Jane Doe',
    nullable: false,
    description: 'The full name of the user',
  })
  @IsString()
  @MinLength(1)
  name: string;
}