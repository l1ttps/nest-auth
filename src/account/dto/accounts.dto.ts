import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ required: true, example: "l1ttps443@gmail.com" })
    readonly email: string;
    @IsNotEmpty()
    @ApiProperty({ required: true, example: "123456" })
    readonly password: string
}

export class SignupDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ required: true, example: "l1ttps443@gmail.com" })
    readonly email: string;

    @ApiProperty({ required: true, example: "123456" })
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    readonly verifyCode: string;


}
export class GetOTPSignUpDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ required: true, example: "l1ttps443@gmail.com" })
    readonly email: string;
}

export class UpdateProfileDto {
    @ApiProperty({ example: 1 })
    gender: string;
    @ApiProperty({ example: new Date() })
    birthday: Date;
    @ApiProperty({ example: "Quang Vinh" })
    name: string
}