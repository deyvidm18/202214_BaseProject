import { IsNotEmpty, IsString } from "class-validator";

export class ClubDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    foundationDate: Date;

}
