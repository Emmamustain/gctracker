import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @Length(3, 50, {
    message: 'Username must be between 3 and 50 characters',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username!: string;

  @IsEmail({}, { message: 'A valid email is required' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 100, {
    message: 'Password must be between 8 and 100 characters',
  })
  password!: string;

  @IsString({ message: 'displayName must be a string' })
  @Length(3, 50, {
    message: 'displayName must be between 3 and 50 characters',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'displayName can only contain letters, numbers, and underscores',
  })
  displayName: string;
}
