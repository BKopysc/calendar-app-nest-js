import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUser, IUserDocument } from 'src/interface/user/IUser.inteface';
import { InputUserDto } from 'src/dto/user/input-user.dto';
import { request } from 'http';
import { AuthGuard } from 'src/authentication/auth.guard';
import { ISimpleUser } from 'src/interface/user/ISimpleUser.interface';
import { ISignedUser } from 'src/interface/user/ISignedUser.interface';
import { SignedUserDto } from 'src/dto/user/signed-user.dto';
import { SimpleUserDto } from 'src/dto/user/simple-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Put(":id")
    public async updateUser(@Req() request, @Res() response, @Param('id') id: string,
        @Body() inputUserDto: InputUserDto): Promise<ISignedUser> {
        
        if(request['jwtUser'].id !== id) {
            return response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Error: user not authorized'
            });
        }

        try {
            const user = await this.usersService.updateUser(request['jwtUser'].id, inputUserDto);
            //response.redirect("/auth/login");
            return response.status(HttpStatus.OK).json(user);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            console.log(error);

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: user not modified'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    public async getSimpleUser(@Req() request, @Res() response, @Param('id') id: string): Promise<ISimpleUser> {
        if(request['jwtUser'].id !== id) {
            return response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Error: user not authorized'
            });
        }

        try {
            const user = await this.usersService.findOneById(id);
            const simpleUser: ISimpleUser = {
                id: user._id.toString(),
                username: user.username
            }
            return response.status(HttpStatus.OK).json(simpleUser);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: user not found'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    public async deleteUser(@Req() request, @Res() response, @Param('id') id: string): Promise<boolean> {
        if(request['jwtUser'].id !== id) {
            return response.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Error: user not authorized'
            });
        }

        try {
            const userDelete = await this.usersService.remove(id);
            return response.status(HttpStatus.OK).json(userDelete);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: user not deleted'
            });
        }
    }

}
