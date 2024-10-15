import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthGoogleLoginDto {
    @IsNotEmpty()
    @IsString()
    token: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(1)
    name: string;
  }