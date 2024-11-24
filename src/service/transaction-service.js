import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { generateInvoiceNumber } from "../utils/transaction-util.js";
import {
  purchaseTransactionValidation,
  topUpTransactionValidation,
} from "../validation/transaction-validation.js";
import { validate } from "../validation/validation.js";

/**
 * @swagger
 * /balance:
 *   get:
 *     summary:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved balance
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
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       example: 100000
 *       401:
 *         description: 	Unauthorized
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
 *       500:
 *         description: Internal server error
 */
const balance = async (request) => {
  try {
    const email = request.user.email;

    // --------- ORM Ver ------------
    // const result = await prismaClient.transaction.findFirst({
    //   where: {
    //     email: email,
    //   },
    //   select: {
    //     current_balance: true,
    //   },
    //   orderBy: {
    //     created_on: "desc",
    //   },
    // });

    // --------- Manual Query Ver ------------
    const result = await prismaClient.$queryRaw`
      SELECT current_balance FROM transactions WHERE email = ${email} ORDER BY created_on DESC LIMIT 1
    `;

    if (!result || result.length == 0) {
      return {
        status: 0,
        message: "Sukses",
        data: { balance: 0 },
      };
    } else {
      return {
        status: 0,
        message: "Sukses",
        data: {
          balance: Array.isArray(result)
            ? result[0].current_balance
            : result.current_balance,
        },
      };
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 102, "Gagal mendapatkan balance");
    }
  }
};

/**
 * @swagger
 * /topup:
 *   post:
 *     summary:
 *     description: Endpoint ini digunakan untuk melakukan top-up saldo pada akun pengguna.
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               top_up_amount:
 *                 type: number
 *                 description: Jumlah saldo yang ingin ditambahkan
 *                 example: 100000
 *
 *     responses:
 *       200:
 *         description: Successfully completed top-up transaction
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
 *                   example: "Top Up Balance berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       description: Saldo yang tersedia setelah top-up
 *                       example: 200000
 *       400:
 *         description: Bad Request - Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
 *                 data:
 *                   type: null
 *                   example: null
 *
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
const topUp = async (request) => {
  try {
    const transaction = validate(topUpTransactionValidation, request);

    const invoiceNumber = await generateInvoiceNumber();

    // --------- ORM Ver ------------
    // const result = await prismaClient.transaction.findFirst({
    //   where: {
    //     email: transaction.email,
    //   },
    //   select: {
    //     current_balance: true,
    //   },
    //   orderBy: {
    //     created_on: "desc",
    //   },
    // });
    // --------- Manual Query Ver ------------
    const result = await prismaClient.$queryRaw`
      SELECT current_balance FROM transactions WHERE email = ${transaction.email} ORDER BY created_on DESC LIMIT 1
    `;

    if (!result || result.length == 0) {
      // --------- ORM Ver ------------
      // await prismaClient.transaction.create({
      //   data: {
      //     email: transaction.email,
      //     invoice_number: invoiceNumber,
      //     total_amount: transaction.top_up_amount,
      //     transaction_type: "TOPUP",
      //     description: "Top Up Balance",
      //     current_balance: transaction.top_up_amount,
      //   },
      // });
      // --------- Manual Query Ver ------------
      await prismaClient.$queryRaw`
      INSERT INTO transactions 
        (email, invoice_number, total_amount, transaction_type, description, current_balance) 
      VALUES 
        (${transaction.email}, ${invoiceNumber}, ${
        transaction.top_up_amount
      }, ${"TOPUP"}, ${"Top Up Balance"}, ${transaction.top_up_amount})`;

      return {
        status: 0,
        message: "Sukses",
        data: { balance: transaction.top_up_amount },
      };
    } else {
      // // --------- ORM Ver ------------
      // await prismaClient.transaction.create({
      //   data: {
      //     email: transaction.email,
      //     invoice_number: invoiceNumber,
      //     total_amount: transaction.top_up_amount,
      //     transaction_type: "TOPUP",
      //     description: "Top Up Balance",
      //     current_balance:
      //       transaction.top_up_amount + result[0].current_balance,
      //   },
      // });
      // --------- Manual Query Ver ------------
      await prismaClient.$queryRaw`
      INSERT INTO transactions 
        (email, invoice_number, total_amount, transaction_type, description, current_balance) 
      VALUES 
        (${transaction.email}, ${invoiceNumber}, ${
        transaction.top_up_amount
      }, ${"TOPUP"}, ${"Top Up Balance"}, ${
        transaction.top_up_amount + result[0].current_balance
      })`;

      return {
        status: 0,
        message: "Sukses",
        data: {
          balance: transaction.top_up_amount + result[0].current_balance,
        },
      };
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 102, "Gagal top-up saldo");
    }
  }
};

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary:
 *     description:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_code:
 *                 type: string
 *                 description: The code of the service being purchased
 *                 example: "PLN"
 *     responses:
 *       200:
 *         description: Purchase transaction completed successfully
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
 *                   type: object
 *                   properties:
 *                     invoice_number:
 *                       type: string
 *                       description: Invoice number of the transaction
 *                       example: "INV20241124-001"
 *                     service_code:
 *                       type: string
 *                       description: Service code for the purchased service
 *                       example: "PLN"
 *                     service_name:
 *                       type: string
 *                       description: The name of the service purchased
 *                       example: "Listrik"
 *                     transaction_type:
 *                       type: string
 *                       description: Type of transaction, e.g., "PAYMENT"
 *                       example: "PAYMENT"
 *                     total_amount:
 *                       type: number
 *                       description: Total amount deducted for the transaction
 *                       example: 100000
 *                     created_on:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the transaction was created
 *                       example: "2024-11-24T14:00:00Z"
 *       400:
 *         description: Invalid input or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Service ataus Layanan tidak ditemukan"
 *                 data:
 *                   type: null
 *                   example: null
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
const purchase = async (request) => {
  try {
    const transaction = validate(purchaseTransactionValidation, request);

    const invoiceNumber = await generateInvoiceNumber();

    // Get Service Table
    // --------- ORM Ver ------------
    // const service = await prismaClient.service.findFirst({
    //   where: {
    //     service_code: transaction.service_code,
    //   },
    //   select: {
    //     service_tarif: true,
    //     service_name: true,
    //   },
    // });
    // --------- Manual Query Ver ------------
    const service = await prismaClient.$queryRaw`
      SELECT service_tarif, service_name FROM services WHERE service_code = ${transaction.service_code} limit 1
    `;

    if (!service || service.length == 0) {
      throw new ResponseError(400, 102, "Service atau Layanan tidak ditemukan");
    }

    //  Get Transaction Tabel
    // --------- ORM Ver ------------
    // const result = await prismaClient.transaction.findFirst({
    //   where: {
    //     email: transaction.email,
    //   },
    //   select: {
    //     current_balance: true,
    //   },
    //   orderBy: {
    //     created_on: "desc",
    //   },
    // });
    // --------- Manual Query Ver ------------
    const result = await prismaClient.$queryRaw`
      SELECT current_balance FROM transactions WHERE email = ${transaction.email} ORDER BY created_on DESC LIMIT 1
    `;

    if (
      !result ||
      result.length == 0 ||
      result.current_balance < service.service_tarif ||
      result[0].current_balance < service[0].service_tarif
    ) {
      throw new ResponseError(500, 102, "Saldo tidak mencukupi");
    } else {
      // Create Transaction
      // --------- ORM Ver ------------
      // await prismaClient.transaction.create({
      //   data: {
      //     email: transaction.email,
      //     service_code: transaction.service_code,
      //     invoice_number: invoiceNumber,
      //     total_amount: service[0].service_tarif,
      //     transaction_type: "PAYMENT",
      //     description: service[0].service_name,
      //     current_balance: result[0].current_balance - service[0].service_tarif,
      //   },
      // });
      // --------- Manual Query Ver ------------
      await prismaClient.$queryRaw`
        INSERT INTO transactions
          (email, service_code, invoice_number, total_amount, transaction_type, description, current_balance)
        VALUES
          (${transaction.email}, ${
        transaction.service_code
      }, ${invoiceNumber}, ${service[0].service_tarif}, ${"PAYMENT"}, ${
        service[0].service_name
      }, ${result[0].current_balance - service[0].service_tarif})`;

      // Get Transaction Detail
      // -------- ORM Ver ------------
      // const purchaseDetail = await prismaClient.transaction.findFirst({
      //   where: {
      //     invoice_number: invoiceNumber,
      //   },
      //   select: {
      //     created_on: true,
      //     service_code: true,
      //     description: true,
      //     total_amount: true,
      //   },
      // });
      // --------- Manual Query Ver ------------
      const purchaseDetail =
        await prismaClient.$queryRaw`SELECT created_on,service_code,description,total_amount FROM transactions WHERE invoice_number = ${invoiceNumber}  LIMIT 1`;

      return {
        status: 0,
        message: "Sukses",
        data: {
          invoice_number: invoiceNumber,
          service_code: purchaseDetail[0].service_code,
          service_name: purchaseDetail[0].description,
          transaction_type: "PAYMENT",
          total_amount: purchaseDetail[0].total_amount,
          created_on: purchaseDetail[0].created_on,
        },
      };
    }
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 102, "Gagal transaksi");
    }
  }
};

/**
 * @swagger
 * /transaction/history:
 *   get:
 *     summary:
 *     description:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: offset
 *         in: query
 *         description:
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *       - name: limit
 *         in: query
 *         description:
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved purchase history
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
 *                   example: "Get History Berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     offset:
 *                       type: integer
 *                       description: The offset used for pagination
 *                       example: 0
 *                     limit:
 *                       type: integer
 *                       description: The limit used for pagination
 *                       example: 5
 *                     records:
 *                       type: array
 *                       description: List of transactions
 *                       items:
 *                         type: object
 *                         properties:
 *                           invoice_number:
 *                             type: string
 *                             description: The invoice number of the transaction
 *                             example: "INV20241124-001"
 *                           transaction_type:
 *                             type: string
 *                             description: Type of transaction (e.g., "PAYMENT")
 *                             example: "PAYMENT"
 *                           description:
 *                             type: string
 *                             description: A description of the transaction
 *                             example: "Listrik"
 *                           total_amount:
 *                             type: number
 *                             description: The total amount of the transaction
 *                             example: 100000
 *                           created_on:
 *                             type: string
 *                             format: date-time
 *                             description: The date and time when the transaction occurred
 *                             example: "2024-11-24T14:00:00Z"
 *                       example:
 *                         - invoice_number: "INV20241124-002"
 *                           transaction_type: "PAYMENT"
 *                           description: "Listrik"
 *                           total_amount: 100000
 *                           created_on: "2024-11-24T14:00:00Z"
 *                         - invoice_number: "INV20241124-001"
 *                           transaction_type: "TopUp"
 *                           description: "Top Up Balance"
 *                           total_amount: 150000
 *                           created_on: "2024-11-23T14:00:00Z"
 *
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
const purchaseHistory = async (request) => {
  try {
    const email = request.user.email;
    const { offset = 0, limit = 5 } = request.query;

    const validatedOffset = parseInt(offset, 10) || 0;
    const validatedLimit = parseInt(limit, 10) || 5;

    const transactions = await prismaClient.$queryRaw`
      SELECT invoice_number, transaction_type, description, total_amount, created_on
      FROM transactions
      WHERE email = ${email}
      ORDER BY created_on DESC
      LIMIT ${validatedLimit} OFFSET ${validatedOffset}
    `;

    return {
      status: 0,
      message: "Get History Berhasil",
      data: {
        offset: validatedOffset,
        limit: validatedLimit,
        records: transactions.map((transaction) => ({
          invoice_number: transaction.invoice_number,
          transaction_type: transaction.transaction_type,
          description: transaction.description,
          total_amount: transaction.total_amount,
          created_on: transaction.created_on,
        })),
      },
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 102, "Gagal mendapatkan riwayat transaksi");
    }
  }
};

export default {
  balance,
  topUp,
  purchase,
  purchaseHistory,
};
