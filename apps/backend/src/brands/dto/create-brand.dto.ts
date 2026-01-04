import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateBrandDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(3, 50, {
    message: 'Name must be between 3 and 50 characters',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Name can only contain letters, numbers, and underscores',
  })
  name!: string;
  @IsString({ message: 'imageUrl must be a string' })
  @Length(3, 200, {
    message: 'imageUrl must be between 3 and 200 characters',
  })
  imageUrl?: string;

  @IsString({ each: true, message: 'Categories must be an array of strings' })
  @IsNotEmpty({ message: 'Categories are required' })
  categories?: string[];
}
