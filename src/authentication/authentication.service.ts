import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InputUserDto } from 'src/dto/user/input-user.dto';
import { ISimpleUser } from 'src/interface/user/ISimpleUser.interface';
import { IUser } from 'src/interface/user/IUser.inteface';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserHashedDto } from 'src/dto/user/create-user-hashed.dto';
import { IException } from 'src/interface/user/IException.interface';
import { JwtService } from '@nestjs/jwt';
import { ISignedUser } from 'src/interface/user/ISignedUser.interface';
import { jwtConstants } from './constants';

@Injectable()
export class AuthenticationService {
    constructor(private readonly userService: UsersService,
        private jwtService: JwtService) {}

    public async register(createUserDto: InputUserDto): Promise<ISignedUser> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const hashedUser = new CreateUserHashedDto(
            createUserDto.username,
            hashedPassword
        );

        const creationResult = await this.userService.create(hashedUser);
        //check if it is exception
        if(creationResult === undefined) {
            throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
        }
        return await this.getSignedUser(creationResult);
    }

    private async getSignedUser(user: ISimpleUser): Promise<ISignedUser> {
        const payload = { username: user.username, id: user.id };
        const jwt = this.jwtService.sign(payload);
        const signedUser: ISignedUser = {
            id: user.id,
            username: user.username,
            authorized:{
                accessToken: jwt,
                expiresIn: jwtConstants.expiresIn,
                tokenType: jwtConstants.tokenType
            }
        }
        return signedUser;
    }

    public async login(loginUserDto: InputUserDto): Promise<ISimpleUser> {
        const user = await this.userService.findOne(loginUserDto.username);
        if(user) {
            const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
            if(isMatch) {
                const simpleUser: ISimpleUser = {
                    id: user._id.toString(),
                    username: user.username
                }
                return await this.getSignedUser(simpleUser);
            }
        }
        throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST);
    }
}
