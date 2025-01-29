import { Controller, Post, Body, UseGuards, Req, Request } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('doctor/v1')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create-prescription')
  createPrescription(@Req() req: Request, @Body() prescription: any) {
    console.log('Received Headers in Doctor Service:', req.headers);
    return this.doctorService.createPrescription(prescription);
  }
}
