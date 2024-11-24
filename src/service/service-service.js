import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

/**
 * @swagger
 * /services:
 *   get:
 *     summary:
 *     description:
 *     tags:
 *       - 2. Module Information
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Sukses"
 *                 data:
 *                   type: array
 *                   description: List of available services
 *                   items:
 *                     type: object
 *                     properties:
 *                       service_name:
 *                         type: string
 *                         description: Name of the service
 *                         example: "Premium Service"
 *                       service_code:
 *                         type: string
 *                         description: Code of the service
 *                         example: "SVC001"
 *                       service_icon:
 *                         type: string
 *                         description: URL or icon for the service
 *                         example: "https://example.com/icon.png"
 *                       service_tarif:
 *                         type: number
 *                         description: The price for the service
 *                         example: 150000
 *               example:
 *                 status: 0
 *                 message: "Sukses"
 *                 data:
 *                   - service_name: "Pajak"
 *                     service_code: "Pajak PBB"
 *                     service_icon: "https://nutech-integrasi.app/dummy.jpg"
 *                     service_tarif: 150000
 *                   - service_name: "PLN"
 *                     service_code: "Listrik"
 *                     service_icon: "https://nutech-integrasi.app/dummy.jpg"
 *                     service_tarif: 400000
 *       401:
 *         description: Unauthorized - Invalid or expired Bearer token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: null
 *                   example: null
 */

const serviceList = async () => {
  try {
    // --------- ORM Ver ------------
    // const result = await prismaClient.service.findMany({
    //   select: {
    //     service_name: true,
    //     service_code: true,
    //     service_icon: true,
    //     service_tarif: true,
    //   },
    // });

    // --------- Manual Query Ver ------------
    const result =
      await prismaClient.$queryRaw`SELECT service_name, service_code, service_icon, service_tarif FROM services`;

    return {
      status: 0,
      message: "Sukses",
      data: result,
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 105, "Gagal mengupload profile image");
    }
  }
};

export default {
  serviceList,
};
