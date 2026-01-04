import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { GiftcardsService } from './giftcards.service';
import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';

@Controller('giftcards')
export class GiftcardsController {
  constructor(private readonly giftcardsService: GiftcardsService) {}

  @Post()
  create(
    @Body() createGiftcardDto: CreateGiftcardDto,
    @Headers('x-giftspace-password') password?: string,
  ) {
    return this.giftcardsService.create(createGiftcardDto, password);
  }

  @Get()
  findAll(@Headers('x-giftspace-password') password?: string) {
    return this.giftcardsService.findAll(password);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('x-giftspace-password') password?: string,
  ) {
    return this.giftcardsService.findOne(id, password);
  }

  @Get('/giftspace/:id')
  findAllByGiftspace(
    @Param('id') id: string,
    @Headers('x-giftspace-password') password?: string,
  ) {
    return this.giftcardsService.findAllByGiftspace(id, password);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGiftcardDto: UpdateGiftcardDto,
    @Headers('x-giftspace-password') password?: string,
  ) {
    return this.giftcardsService.update(id, updateGiftcardDto, password);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('x-giftspace-password') password?: string,
  ) {
    return this.giftcardsService.remove(id, password);
  }
}
