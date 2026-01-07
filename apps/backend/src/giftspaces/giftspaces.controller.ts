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

  // More specific routes must come before generic ones
  @Get('/shared/:userId')
  findAllShared(@Param('userId') userId: string) {
    return this.giftspacesService.findAllShared(userId);
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.giftspacesService.findOne(id);
  }

  @Get(':id/users')
  getGiftspaceUsers(@Param('id') id: string) {
    return this.giftspacesService.getGiftspaceUsers(id);
  }

  @Post(':id/users')
  addUserToGiftspace(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return this.giftspacesService.addUserToGiftspace(id, body.userId);
  }

  @Delete(':id/users/:userId')
  removeUserFromGiftspace(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.giftspacesService.removeUserFromGiftspace(id, userId);
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

  // Generic route must come last
  @Get(':owner')
  findAllByOwner(@Param('owner') owner: string) {
    return this.giftspacesService.findAllByOwner(owner);
  }
}
