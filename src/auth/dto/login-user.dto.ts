import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';


export class LoginUserDto {

    @ApiProperty({
        example: "janedoe@gmail.com",
        nullable: false,
        description: 'The email of the user (unique)',
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: "Jane123",
        nullable: false,
        description: 'The password of the user',
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}