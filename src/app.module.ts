import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorController } from './doctor/doctor.controller';
import { DoctorService } from './doctor/doctor.service';
import { JwtStrategy } from './doctor/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret-key', // Same as auth-service
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController, DoctorController],
  providers: [AppService, DoctorService, JwtStrategy],
})
export class AppModule {}
