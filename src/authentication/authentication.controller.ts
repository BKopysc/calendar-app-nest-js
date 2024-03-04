import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { InputUserDto } from 'src/dto/user/input-user.dto';
import { ISimpleUser } from 'src/interface/user/ISimpleUser.interface';

@Controller('auth')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationService) { }

    @Post('register')
    async register(@Res() response, @Body() createUserDto: InputUserDto): Promise<ISimpleUser> {
        try {
            const createUser = await this.authenticationService.register(createUserDto);
            return response.status(HttpStatus.CREATED).json(createUser);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: user not registered'
            });
        }
    }

    @Post('login')
    async login(@Res() response, @Body() loginUserDto: InputUserDto): Promise<ISimpleUser> {
        try {
            const loginUser = await this.authenticationService.login(loginUserDto);
            return response.status(HttpStatus.OK).json(loginUser);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: user not signed in'
            });
        }
    }
}
