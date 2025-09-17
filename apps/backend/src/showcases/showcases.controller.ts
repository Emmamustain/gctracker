import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ShowcasesService } from './showcases.service';
import { CreateShowcaseDto } from './dto/create-showcase.dto';
import { UpdateShowcaseDto } from './dto/update-showcase.dto';
import { Request } from 'express';
import { TReqUser } from '@shared/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('showcases')
export class ShowcasesController {
  constructor(private readonly showcasesService: ShowcasesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createShowcaseDto: CreateShowcaseDto) {
    const userId = (req.user as TReqUser)?.userId;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.showcasesService.create(createShowcaseDto, userId);
  }

  @Get()
  findAll() {
    return this.showcasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showcasesService.findOne(id);
  }

  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.showcasesService.findOneBySlug(slug);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShowcaseDto: UpdateShowcaseDto,
  ) {
    return this.showcasesService.update(id, updateShowcaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.showcasesService.remove(id);
  }
}
