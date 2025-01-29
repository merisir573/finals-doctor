import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';  

@Injectable()
export class DoctorService {
  private readonly rabbitmqUri = process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672';  // CloudAMQP or Docker URI

  private async isPrescriptionIdExists(prescriptionId: string) {
    const connection = await amqp.connect(this.rabbitmqUri);
    const channel = await connection.createChannel();
    const queue = 'prescriptions';

    await channel.assertQueue(queue, { durable: true });

    let messages = await channel.get(queue, { noAck: false });

    while (messages) {
      const prescription = JSON.parse(messages.content.toString());

      if (prescription.prescriptionId === prescriptionId) {
        channel.nack(messages, false, true); // Requeue the message
        return true;
      }

      messages = await channel.get(queue, { noAck: false });
    }

    return false;
  }

  private async sendToQueue(prescription: any) {
    const connection = await amqp.connect(this.rabbitmqUri);
    const channel = await connection.createChannel();
    const queue = 'prescriptions';

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(prescription)), { persistent: true });

    console.log(`Prescription Queued: ${JSON.stringify(prescription)}`);
  }

  async createPrescription(prescription: any) {
    if (!prescription.prescriptionId || !prescription.patientTc || !prescription.medicines || !prescription.patientName) {
      throw new Error('Missing required fields: prescriptionId, patientTc, patientName, or medicines.');
    }

    const exists = await this.isPrescriptionIdExists(prescription.prescriptionId);
    if (exists) {
      return { status: 'Error', message: 'Prescription ID already exists in queue.' };
    }

    const fullPrescription = {
      prescriptionId: prescription.prescriptionId,
      patientTc: prescription.patientTc,
      patientName: prescription.patientName,
      medicines: prescription.medicines,
      date: new Date(),
    };

    await this.sendToQueue(fullPrescription);
    return { status: 'Success', message: 'Prescription queued successfully.' };
  }
}
