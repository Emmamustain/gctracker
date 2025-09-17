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
import { CurationsService } from './curations.service';
import { CreateCuratedShowcaseDto } from './dto/create-curated-showcase.dto';
import { UpdateCuratedShowcaseDto } from './dto/update-curated-showcase.dto';
import { Request } from 'express';
import { TReqUser } from '@shared/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCuratedCollectionDto } from './dto/create-curated-collection.dto';
import { UpdateCuratedCollectionDto } from './dto/update-curated-collection.dto';

@Controller('curations')
export class CurationsController {
  constructor(private readonly curationsService: CurationsService) {}

  // Showcases

  @UseGuards(JwtAuthGuard)
  @Post('/showcases')
  createCuratedShowcase(
    @Req() req: Request,
    @Body() createShowcaseDto: CreateCuratedShowcaseDto,
  ) {
    const userId = (req.user as TReqUser)?.userId;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.curationsService.createCuratedShowcase(
      createShowcaseDto,
      userId,
    );
  }

  @Get('/showcases')
  findAllCuratedShowcase() {
    return this.curationsService.findAllCuratedShowcases();
  }

  @Patch('/showcases/:id')
  updateCuratedShowcase(
    @Param('id') id: string,
    @Body() updateShowcaseDto: UpdateCuratedShowcaseDto,
  ) {
    return this.curationsService.updateCuratedShowcase(id, updateShowcaseDto);
  }

  @Delete('/showcases/:id')
  removeCuratedShowcase(@Param('id') id: string) {
    return this.curationsService.removeCuratedShowcase(id);
  }

  // Collections

  @UseGuards(JwtAuthGuard)
  @Post('/collections')
  createCuratedCollection(
    @Req() req: Request,
    @Body() createCollectionDto: CreateCuratedCollectionDto,
  ) {
    const userId = (req.user as TReqUser)?.userId;
    if (!userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.curationsService.createCuratedCollection(
      createCollectionDto,
      userId,
    );
  }

  @Get('/collections')
  findAllCuratedCollection() {
    return this.curationsService.findAllCuratedCollections();
  }

  @Patch('/collections/:id')
  updateCuratedCollection(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCuratedCollectionDto,
  ) {
    return this.curationsService.updateCuratedCollection(
      id,
      updateCollectionDto,
    );
  }

  @Delete('/collections/:id')
  removeCuratedCollection(@Param('id') id: string) {
    return this.curationsService.removeCuratedCollection(id);
  }
}
