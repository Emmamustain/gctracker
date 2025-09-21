import { PartialType } from '@nestjs/mapped-types';
import { CreateGiftspaceDto } from './create-giftspace.dto';

export class UpdateGiftspaceDto extends PartialType(CreateGiftspaceDto) {}
