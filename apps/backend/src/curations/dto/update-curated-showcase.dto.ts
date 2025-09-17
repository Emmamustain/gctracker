import { PartialType } from '@nestjs/mapped-types';
import { CreateCuratedShowcaseDto } from './create-curated-showcase.dto';

export class UpdateCuratedShowcaseDto extends PartialType(
  CreateCuratedShowcaseDto,
) {}
