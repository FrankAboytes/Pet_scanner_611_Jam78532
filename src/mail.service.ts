import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  
  async sendMatchNotification(lostPet: any, foundPet: any, foundLng: number, foundLat: number) {
    // 1. Creamos una cuenta de prueba temporal automáticamente
    const testAccount = await nodemailer.createTestAccount();

    // 2. Usamos esa cuenta para enviar el correo
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 3. Coordenadas de la mascota perdida
    const lostLng = lostPet.lost_lng;
    const lostLat = lostPet.lost_lat;

    // 4. Generar mapa de Mapbox (Asegúrate de poner tu token real aquí)
    const mapboxToken = 'TU_TOKEN_DE_MAPBOX_AQUI'; 
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s-a+f00(${lostLng},${lostLat}),pin-s-b+00f(${foundLng},${foundLat})/auto/600x400?access_token=${mapboxToken}`;

    const mailOptions = {
      from: '"PetRadar System" <petradar@example.com>',
      to: lostPet.owner_email,
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

    // 5. Enviamos el correo y obtenemos la URL para verlo
    const info = await transporter.sendMail(mailOptions);
    
    console.log('-----------------------------------------');
    console.log('¡MATCH ENCONTRADO EN EL RADIO DE 500M!');
    console.log('Vista previa del correo enviada a Ethereal:');
    console.log(nodemailer.getTestMessageUrl(info));
    console.log('-----------------------------------------');
  }
}