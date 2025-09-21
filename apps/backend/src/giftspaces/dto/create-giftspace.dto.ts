import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateGiftspaceDto {
  @IsString({ message: 'name must be a string' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Name can only contain letters, numbers, and underscores',
  })
  name: string;

  @IsString({ message: 'Password must be a string' })
  @Length(4, 100, {
    message: 'Password must be between 4 and 100 characters',
  })
  password: string;

  @IsString({ message: 'Owner must be a string' })
  @IsNotEmpty({ message: 'Owner is required' })
  owner!: string;
}
