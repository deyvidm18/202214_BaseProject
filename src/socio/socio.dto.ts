import { isEmail, IsNotEmpty, IsString } from "class-validator";

export class SocioDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    birthdate: Date;

}
