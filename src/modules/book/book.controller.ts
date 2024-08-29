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
import { BookService } from './book.service';

// Dto
import { BookDto } from './dto/book.dto';
import { BookListDto } from './dto/book-list.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { GetBookListDto } from './dto/get-book-list.dto';

@ApiTags('Book')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized.' })
@UseGuards(JwtAuthGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The book has been successfully created.',
    example: {
      id: '66cf1c595b1b118f35bd5ab7',
      title: 'Harry Potter',
      author: 'J. K. Rowling',
      isbn: '9780733426094',
      publication_date: '2024-09-01T00:00:00Z',
    },
  })
  @ApiBadRequestResponse({ description: 'The ISBN already exist.' })
  @ApiBadRequestResponse({ description: 'Invalid DTO payload.' })
  async create(@Body() body: BookDto): Promise<BookDto> {
    return await this.bookService.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Book id',
  })
  @ApiOkResponse({
    description: 'The book has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'The book does not exist.' })
  @ApiBadRequestResponse({ description: 'Invalid DTO payload.' })
  async update(@Body() body: BookDto, @Param('id') id: string): Promise<void> {
    await this.bookService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Book id',
  })
  @ApiOkResponse({
    description: 'The book has been successfully deleted.',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.bookService.delete(id);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'content',
    required: false,
    description: 'Search book by author or title',
  })
  @ApiOkResponse({
    description: 'The search result successfully returned.',
    example: [
      {
        id: '66cf1c595b1b118f35bd5ab7',
        title: 'Harry Potter',
        author: 'J. K. Rowling',
        isbn: '9780733426094',
        publication_date: '2024-09-01T00:00:00Z',
      },
    ],
  })
  async searchBook(@Query() query: SearchBookDto): Promise<Array<BookDto>> {
    return await this.bookService.searchBook(query.content);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Book id',
  })
  @ApiBadRequestResponse({
    description: 'The book does not exist.',
  })
  @ApiOkResponse({
    description: 'The book successfully returned.',
    example: {
      id: '66cf1c595b1b118f35bd5ab7',
      title: 'Harry Potter',
      author: 'J. K. Rowling',
      isbn: '9780733426094',
      publication_date: '2024-09-01T00:00:00Z',
    },
  })
  async getOne(@Param('id') id: string): Promise<BookDto> {
    return await this.bookService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'cursor',
    required: false,
    description:
      'Cursor pagination id. If it is empty, will return first page of list of books.',
  })
  @ApiOkResponse({
    description: 'The book list successfully returned.',
    example: {
      books: [
        {
          id: '66cf1c595b1b118f35bd5ab7',
          title: 'Harry Potter',
          author: 'J. K. Rowling',
          isbn: '9780733426094',
          publication_date: '2024-09-01T00:00:00Z',
        },
      ],
      cursor: null,
      is_last_page: true,
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid DTO payload.' })
  async getBookList(@Query() query: GetBookListDto): Promise<BookListDto> {
    return await this.bookService.getBookList(query.cursor);
  }
}
