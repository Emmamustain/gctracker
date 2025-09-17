import {
  IsBoolean,
  IsDateString, // For timestamp fields like startDate, endDate
  IsInt, // For integer fields like position
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateCuratedShowcaseDto {
  @IsUUID('4', { message: 'showcaseId must be a valid UUID' })
  @IsNotEmpty()
  showcaseId!: string; // This is the ID of the existing showcase you want to curate.

  @IsString()
  @IsNotEmpty()
  @Length(3, 200)
  title!: string; // Optional: Override title for the curated entry (if different from the original showcase)

  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  thumbnailUrl?: string; // Optional: Override thumbnail URL for the curated entry

  @IsOptional()
  @IsUrl()
  @Length(1, 500)
  linkUrl?: string; // Optional: A specific link for this curated entry (e.g., a special landing page)

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number; // Optional: The display order of this curated showcase

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean; // Optional: Whether this curated entry should be publicly visible

  @IsOptional()
  @IsDateString()
  startDate?: string; // Optional: When this curation should become active

  @IsOptional()
  @IsDateString()
  endDate?: string; // Optional: When this curation should expire
}
