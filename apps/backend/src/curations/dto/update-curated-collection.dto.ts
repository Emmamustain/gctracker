import { PartialType } from '@nestjs/mapped-types';
import { CreateCuratedCollectionDto } from './create-curated-collection.dto';

export class UpdateCuratedCollectionDto extends PartialType(
  CreateCuratedCollectionDto,
) {}
