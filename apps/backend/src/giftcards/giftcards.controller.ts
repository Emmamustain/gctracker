import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GiftcardsService } from './giftcards.service';
import { CreateGiftcardDto } from './dto/create-giftcard.dto';
import { UpdateGiftcardDto } from './dto/update-giftcard.dto';

@Controller('giftcards')
export class GiftcardsController {
  constructor(private readonly giftcardsService: GiftcardsService) {}

  @Post()
  create(@Body() createGiftcardDto: CreateGiftcardDto) {
    return this.giftcardsService.create(createGiftcardDto);
  }

  @Get()
  findAll() {
    return this.giftcardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftcardsService.findOne(id);
  }

  @Get('/giftspace/:id')
  findAllByGiftspace(@Param('id') id: string) {
    return this.giftcardsService.findAllByGiftspace(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGiftcardDto: UpdateGiftcardDto,
  ) {
    return this.giftcardsService.update(id, updateGiftcardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftcardsService.remove(id);
  }
}
