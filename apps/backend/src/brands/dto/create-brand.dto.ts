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

  @IsString({ message: 'A valid category is required' })
  @IsNotEmpty({ message: 'Category is required' })
  category!: string;
}
