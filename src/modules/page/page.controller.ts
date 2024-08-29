// Nest
import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';

// Swagger
import {
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

// Guard
import { JwtAuthGuard } from '../../guards/jwt.guard';

// Service
import { PageService } from './page.service';

// Dto
import { PageDto } from './dto/page.dto';
import { PageListDto } from './dto/page-list.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { GetPageListDto } from './dto/get-page-list.dto';

@ApiTags('Page')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@UseGuards(JwtAuthGuard)
@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The page has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'The page already exist.' })
  @ApiBadRequestResponse({ description: 'Invalid DTO payload.' })
  async create(@Body() body: PageDto): Promise<PageDto> {
    return await this.pageService.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Page id',
  })
  @ApiOkResponse({
    description: 'The page content has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The page does not exist.' })
  @ApiBadRequestResponse({ description: 'Invalid DTO payload.' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePageDto,
  ): Promise<void> {
    await this.pageService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Page id',
  })
  @ApiOkResponse({
    description: 'The page has been successfully deleted.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.pageService.delete(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Page id',
  })
  @ApiBadRequestResponse({
    description: 'The page does not exist.',
  })
  @ApiOkResponse({
    description: 'The page successfully returned.',
    example: {
      id: '66cf3e92d74476bc778992a3',
      page_number: 13,
      content: 'Avada kedavra!',
      book_id: '66cf1c595b1b118f35bd5ab7',
    },
  })
  async getOne(@Param('id') id: string): Promise<PageDto> {
    return await this.pageService.getOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'Cursor pagination id. If it is empty, will return first page of list of pages.',
  })
  @ApiOkResponse({
    description: 'The page list successfully returned.',
    example: {
      books: [
        {
          id: '66cf3e92d74476bc778992a3',
          page_number: 13,
          content: 'Avada kedavra!',
          book_id: '66cf1c595b1b118f35bd5ab7',
        },
      ],
      cursor: null,
      is_last_page: true,
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid DTO payload.' })
  async getPageList(@Query() query: GetPageListDto): Promise<PageListDto> {
    return await this.pageService.getBookList(query.book_id, query.cursor);
  }
}
