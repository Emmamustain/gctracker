import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GiftspacesService } from './giftspaces.service';
import { CreateGiftspaceDto } from './dto/create-giftspace.dto';
import { UpdateGiftspaceDto } from './dto/update-giftspace.dto';

@Controller('giftspaces')
export class GiftspacesController {
  constructor(private readonly giftspacesService: GiftspacesService) {}

  @Post()
  create(@Body() createGiftspacesDto: CreateGiftspaceDto) {
    return this.giftspacesService.create(createGiftspacesDto);
  }

  @Get()
  findAll() {
    return this.giftspacesService.findAll();
  }

  @Get(':owner')
  findAllByOwner(@Param('owner') owner: string) {
    return this.giftspacesService.findAllByOwner(owner);
  }

  @Get('/shared/:userId')
  findAllShared(@Param('userId') userId: string) {
    return this.giftspacesService.findAllShared(userId);
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.giftspacesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGiftspaceDto: UpdateGiftspaceDto,
  ) {
    return this.giftspacesService.update(id, updateGiftspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftspacesService.remove(id);
  }
}
