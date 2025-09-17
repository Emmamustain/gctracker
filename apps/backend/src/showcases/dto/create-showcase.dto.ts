import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateShowcaseDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUrl()
  @IsNotEmpty()
  @Length(1, 500)
  thumbnailUrl!: string;

  @IsUrl()
  @IsNotEmpty()
  @Length(1, 500)
  zipFileUrl!: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  @Min(0)
  price?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  osCompatibility?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  shellCompatibility?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  difficultyLevel?: string;

  @IsOptional()
  @IsString()
  installationInstructions?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  version?: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  @Min(0)
  fileSizeMb?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
