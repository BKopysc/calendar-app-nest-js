import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/authentication/auth.guard';
import { ISimpleTag } from 'src/interface/tag/ITag.interface';
import { TagsService } from './tags.service';
import { InputTagDto } from 'src/dto/tag/input-tag.dto';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @UseGuards(AuthGuard)
    @Get()
    public async getTags(@Req() request, @Res() response): Promise<ISimpleTag[]> {

        try {
            const tags = await this.tagsService.getAllTags(request['jwtUser'].id);
            return response.status(HttpStatus.OK).json(tags);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: tags not found'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Post()
    public async createTag(@Req() request, @Res() response, 
        @Body() inputTagDto: InputTagDto): Promise<ISimpleTag> {
        try {
            inputTagDto.userId = request['jwtUser'].id;
            const tag = await this.tagsService.createTag(request['jwtUser'].id, inputTagDto);
            return response.status(HttpStatus.CREATED).json(tag);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: tag not created'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Put(":id")
    public async editTag(@Req() request, @Res() response,
        @Param('id') id: string, @Body() inputTagDto: InputTagDto): Promise<ISimpleTag> {
        try {
            const tag = await this.tagsService.editTag(request['jwtUser'].id, id, inputTagDto);
            return response.status(HttpStatus.OK).json(tag);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: tag not edited'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    public async getTag(@Req() request, @Res() response, @Param('id') id: string): Promise<ISimpleTag> {
        try {
            const tag = await this.tagsService.getTagById(request['jwtUser'].id, id);
            return response.status(HttpStatus.OK).json(tag);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: tag not found'
            });
        }
    }

    @UseGuards(AuthGuard)
    @Delete(":id")
    public async deleteTag(@Req() request, @Res() response, @Param('id') id: string): Promise<boolean> {
        try {
            const tag = await this.tagsService.deleteTagById(request['jwtUser'].id, id);
            console.log("Tag deleted")
            return response.status(HttpStatus.OK).json(tag);
        } catch (error) {
            if (error.getStatus) {
                return response.status(error.getStatus()).json({
                    statusCode: error.getStatus(),
                    message: error.message
                });
            }

            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Error: tag not deleted'
            });
        }
    }
}
