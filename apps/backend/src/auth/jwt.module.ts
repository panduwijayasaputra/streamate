import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('api.jwtSecret'),
        signOptions: {
          expiresIn: '7d', // Token expires in 7 days
          issuer: 'streamate',
          audience: 'streamate-users',
        },
        verifyOptions: {
          issuer: 'streamate',
          audience: 'streamate-users',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class JwtAuthModule {}
