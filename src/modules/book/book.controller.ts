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

// Guard
import { JwtAuthGuard } from '../../guards/jwt.guard';

// Service
import { BookService } from './book.service';

// Dto
import { BookDto } from './dto/book.dto';
import { BookListDto } from './dto/book-list.dto';
import { GetBookListDto } from './dto/get-book-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: BookDto): Promise<void> {
    await this.bookService.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() body: BookDto, @Param('id') id: string): Promise<void> {
    await this.bookService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    await this.bookService.delete(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<BookDto> {
    return await this.bookService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getBookList(@Query() query: GetBookListDto): Promise<BookListDto> {
    return await this.bookService.getBookList(query.cursor);
  }
}
