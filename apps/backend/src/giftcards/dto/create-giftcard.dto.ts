import {
  IsBoolean,
  IsDecimal,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateGiftcardDto {
  @IsString({ message: 'Name must be a string' })
  @Length(1, 50, {
    message: 'Name must be between 3 and 50 characters',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Name can only contain letters, numbers, and underscores',
  })
  name: string;

  @IsString({ message: 'Code must be a string' })
  @IsNotEmpty({ message: 'Code is required' })
  @Length(5, 100, {
    message: 'Code must be between 8 and 100 characters',
  })
  code!: string;

  @IsString({ message: 'Pin must be a string' })
  @Length(2, 100, {
    message: 'Pin must be between 8 and 100 characters',
  })
  pin: string;

  @IsDecimal(
    { locale: 'en-GB' },
    { message: 'Balance must be a valid decimal number' },
  )
  balance: string;

  @IsBoolean({ message: 'Favorite must be boolean' })
  favorite: boolean;

  @IsString({ message: 'Giftspace must be a string' })
  @IsNotEmpty({ message: 'Giftspace is required' })
  giftspace!: string;

  @IsString({ message: 'Brand must be a string' })
  @IsNotEmpty({ message: 'Brand is required' })
  brand!: string;
}
