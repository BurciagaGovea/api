// https://www.rabbitmq.com/tutorials/tutorial-one-javascript
import amqp from "amqplib";
import dotenv from "dotenv";
import { createUserFromClient } from "../controllers/userController.js";

dotenv.config();

const RABBIT_PROTOCOL = process.env.RABBITMQ_PROTOCOL || "amqps";
const RABBIT_HOST = process.env.RABBITMQ_HOST;
const RABBIT_PORT = process.env.RABBITMQ_PORT || 5672;
const RABBIT_USER = process.env.RABBITMQ_USER;
const RABBIT_PASSWORD = process.env.RABBITMQ_PASSWORD;
const RABBIT_VHOST = process.env.RABBITMQ_VHOST || "/";
const RABBIT_EXCHANGE = "client_created";
const QUEUE_NAME = "user_creation_queue";
// console.log("conectando a", process.env.RABBIT_URL)


async function startConsumer() {
    try {
        // const connection = await amqp.connect();
        const connection = await amqp.connect(process.env.RABBIT_URL);


        const channel = await connection.createChannel();
        await channel.assertExchange(RABBIT_EXCHANGE, "topic", { durable: true });
        const q = await channel.assertQueue(QUEUE_NAME, { durable: true });

        await channel.bindQueue(q.queue, RABBIT_EXCHANGE, "client.new");

        console.log(`Esperando mensajes en: ${RABBIT_EXCHANGE}`);

        channel.consume(q.queue, async (msg) => {
            if (msg !== null) {
                const clientData = JSON.parse(msg.content.toString());
                console.log("Mensaje recibido:", clientData);

                try {
                    await createUserFromClient(clientData);
                    channel.ack(msg);
                } catch (error) {
                    console.error("Error procesando mensaje:", error);
                }
            }
        });

    } catch (error) {
        console.error("Error conectando con RabbitMQ:", error);
    }
}

export default startConsumer;
