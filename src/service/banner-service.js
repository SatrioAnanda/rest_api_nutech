import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

/**
 * @swagger
 * /banner:
 *   get:
 *     summary:
 *     description:
 *     tags:
 *       - 2. Module Information
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of banners
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
 *                   description: List of available banners
 *                   items:
 *                     type: object
 *                     properties:
 *                       banner_name:
 *                         type: string
 *                         description: Name of the banner
 *                         example: "Winter Sale"
 *                       banner_image:
 *                         type: string
 *                         description: URL or path to the banner image
 *                         example: "https://example.com/banner.png"
 *                       description:
 *                         type: string
 *                         description: Description of the banner
 *                         example: "A special winter sale banner with discounts on all items"
 *               example:
 *                 status: 0
 *                 message: "Sukses"
 *                 data:
 *                   - banner_name: "Banner 1"
 *                     banner_image: "https://nutech-integrasi.app/dummy.jpg"
 *                     description: "Lerem Ipsum Dolor sit amet"
 *                   - banner_name: "Banner 2"
 *                     banner_image: "https://nutech-integrasi.app/dummy.jpg"
 *                     description: "Lerem Ipsum Dolor sit amet"
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
const bannerList = async () => {
  try {
    // --------- ORM Ver ------------
    // const result = await prismaClient.banner.findMany({
    //   select: { banner_name: true, banner_image: true, description: true },
    // });

    // --------- Manual Query Ver ------------
    const result =
      await prismaClient.$queryRaw`SELECT banner_name, banner_image, description FROM banners`;

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
  bannerList,
};
