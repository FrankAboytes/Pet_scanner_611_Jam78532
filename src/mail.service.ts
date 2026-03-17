import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // O el servicio que uses
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendMatchNotification(lostPet: any, foundPet: any) {
    // Extraer coordenadas (GeoJSON usa [longitud, latitud])
    const lostLng = lostPet.location.coordinates[0];
    const lostLat = lostPet.location.coordinates[1];
    const foundLng = foundPet.location.coordinates[0];
    const foundLat = foundPet.location.coordinates[1];

    // Generar mapa estático de Mapbox con dos pines
    const mapboxToken = process.env.MAPBOX_TOKEN;
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+f00(${lostLng},${lostLat}),pin-s-b+00f(${foundLng},${foundLat})/auto/600x400?access_token=${mapboxToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: lostPet.owner_email, // O al correo genérico que te pidan
      subject: '¡Posible coincidencia de tu mascota perdida!',
      html: `
        <h2>¡Hola ${lostPet.owner_name}!</h2>
        <p>Alguien ha encontrado una mascota que coincide con la zona donde se perdió la tuya.</p>
        <h3>Datos de la mascota encontrada:</h3>
        <ul>
          <li><strong>Especie:</strong> ${foundPet.species}</li>
          <li><strong>Color:</strong> ${foundPet.color}</li>
          <li><strong>Descripción:</strong> ${foundPet.description}</li>
        </ul>
        <h3>Datos de contacto de quien la encontró:</h3>
        <ul>
          <li><strong>Nombre:</strong> ${foundPet.finder_name}</li>
          <li><strong>Teléfono:</strong> ${foundPet.finder_phone}</li>
          <li><strong>Email:</strong> ${foundPet.finder_email}</li>
        </ul>
        <h3>Ubicación (Rojo: Perdida, Azul: Encontrada)</h3>
        <img src="${mapUrl}" alt="Mapa de ubicaciones" />
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}