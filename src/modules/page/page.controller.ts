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
import { PageService } from './page.service';

// Dto
import { PageDto } from './dto/page.dto';
import { PageListDto } from './dto/page-list.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { GetPageListDto } from './dto/get-page-list.dto';

@UseGuards(JwtAuthGuard)
@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: PageDto): Promise<void> {
    await this.pageService.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePageDto,
  ): Promise<void> {
    await this.pageService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<void> {
    await this.pageService.delete(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string): Promise<PageDto> {
    return await this.pageService.getOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPageList(@Query() query: GetPageListDto): Promise<PageListDto> {
    return await this.pageService.getBookList(query.book_id, query.cursor);
  }
}
