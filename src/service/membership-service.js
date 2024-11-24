import { validate } from "../validation/validation.js";
import {
  loginMembershipValidation,
  registerMembershipValidation,
  updateMembershipValidation,
} from "../validation/membership-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  comparePassword,
  generateToken,
  getBaseURL,
  hashPassword,
  verifyToken,
} from "../utils/auth.js";


/**
 * @swagger
 * /registration:
 *   post:
 *     summary:
 *     description:
 *     tags:
 *       - 1. Membership Module
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "satrioananda@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               first_name:
 *                 type: string
 *                 example: "Satrio"
 *               last_name:
 *                 type: string
 *                 example: "Ananda"
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil silahkan login"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Invalid input or email already registered
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
 *                   example: "Paramter email tidak sesuai format"
 *                 data:
 *                   type: null
 *                   example: null
 */

const register = async (request) => {
  try {
    const membership = validate(registerMembershipValidation, request);

    // --------- ORM Ver ------------
    const countMembership = await prismaClient.membership.count({
      where: {
        email: membership.email,
      },
    });

    // --------- Manual Query Ver ------------
    // const countMembership =
    //   await prismaClient.$queryRaw`SELECT COUNT(*) FROM memberships WHERE email = ${membership.email}`;

    if (
      Array.isArray(countMembership)
        ? countMembership[0].count == 1
        : countMembership === 1
    ) {
      throw new ResponseError(400, 102, "Email sudah terdaftar");
    }

    membership.password = await hashPassword(membership.password);

    // --------- ORM Ver ------------
    // await prismaClient.membership.create({
    //   data: membership,
    // });

    // --------- Manual Query Ver ------------
    await prismaClient.$queryRaw`
    INSERT INTO memberships (email, password, first_name, last_name) 
    VALUES (${membership.email}, ${membership.password}, ${membership.first_name}, ${membership.last_name})`;

    return {
      status: 201,
      message: "Registrasi berhasil silahkan login",
      data: null,
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 102, "Gagal melakukan registrasi");
    }
  }
};

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - 1. Membership Module
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "satrioananda@gmail.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful and returns a token
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
 *                   example: "Login Sukses"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzI0Mzk2NTAsImV4cCI6MTczMjQ4Mjg1MH0.A1Mdkrm7aNxoWXUkkbzILnboyoZvYDEJtoMnxjacqNY"
 *       400:
 *         description: Incorrect email or password
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
 *                   example: "Email atau password salah"
 *       401:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 103
 *                 message:
 *                   type: string
 *                   example: "Username atau password salah"
 *                 data:
 *                   type: null
 *                   example: null
 */
const login = async (request) => {
  try {
    const membership = validate(loginMembershipValidation, request);

    // --------- ORM Ver ------------
    // const result = await prismaClient.membership.findUnique({
    //   where: {
    //     email: membership.email,
    //   },
    //   select: {
    //     email: true,
    //     password: true,
    //   },
    // });

    // --------- Manual Query Ver ------------
    const result = await prismaClient.$queryRaw`
      SELECT email, password FROM memberships WHERE email = ${membership.email} limit 1
    `;

    if (result.length == 0 || !result) {
      throw new ResponseError(400, 103, "Email atau password salah");
    }

    const isMatch = await comparePassword(
      membership.password,
      Array.isArray(result) ? result[0].password : result.password
    );

    if (!isMatch) {
      throw new ResponseError(400, 103, "Email atau password salah");
    }

    const token = generateToken(Array.isArray(result) ? result[0] : result);
    return {
      status: 0,
      message: "Login Sukses",
      data: {
        token: token,
      },
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(400, 103, "Email atau password salah");
    }
  }
};

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get member profile
 *     description: This endpoint allows a user to retrieve their profile details.
 *     tags:
 *       - 1. Membership Module
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved profile
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
 *                     email:
 *                       type: string
 *                       example: "satrioananda@gmail.com"
 *                     first_name:
 *                       type: string
 *                       example: "satrio"
 *                     last_name:
 *                       type: string
 *                       example: "ananda"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/path/to/profile-image.jpg"
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
const profile = async (request) => {
  try {
    const email = request.user.email;

    // --------- ORM Ver ------------
    // const result = await prismaClient.membership.findUnique({
    //   where: {
    //     email: email,
    //   },
    //   select: {
    //     email: true,
    //     first_name: true,
    //     last_name: true,
    //     profile_image: true,
    //   },
    // });

    // --------- Manual Query Ver ------------
    const result = await prismaClient.$queryRaw`
    SELECT email, first_name, last_name, profile_image FROM memberships WHERE email = ${email}
  `;

    if (!result) {
      throw new ResponseError(400, 103, "Profile tidak ditemukan");
    }
    return {
      status: 0,
      message: "Sukses",
      data: Array.isArray(result) ? result[0] : result,
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 102, "Gagal mendapatkan profile");
    }
  }
};

/**
 * @swagger
 * /profile/update:
 *   put:
 *     tags:
 *       - 1. Membership Module
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Satrio"
 *               last_name:
 *                 type: string
 *                 example: "Ananda"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Update Pofile berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "satrioananda@gmail.com"
 *                     first_name:
 *                       type: string
 *                       example: "Satrio"
 *                     last_name:
 *                       type: string
 *                       example: "Ananda"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/path/to/profile-image.jpg"
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

const update = async (request) => {
  try {
    const membership = validate(updateMembershipValidation, request);

    // --------- ORM Ver ------------
    // const result = await prismaClient.membership.update({
    //   where: {
    //     email: membership.email,
    //   },
    //   data: {
    //     first_name: membership.first_name,
    //     last_name: membership.last_name,
    //   },
    //   select: {
    //     email: true,
    //     first_name: true,
    //     last_name: true,
    //     profile_image: true,
    //   },
    // });

    // --------- Manual Query Ver ------------
    await prismaClient.$queryRaw`
      UPDATE memberships SET first_name = ${membership.first_name}, last_name = ${membership.last_name} WHERE email = ${membership.email}
    `;

    const result = await prismaClient.$queryRaw`
      SELECT email, first_name, last_name, profile_image FROM memberships WHERE email = ${membership.email} limit 1
    `;

    return {
      status: 0,
      message: "Update Pofile berhasil",
      data: Array.isArray(result) ? result[0] : result,
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 102, "Gagal update profile");
    }
  }
};

/**
 * @swagger
 * /profile/image:
 *   put:
 *     tags:
 *       - 1. Membership Module
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
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
 *                   example: "Upload profile berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "satrioananda@gmail.com"
 *                     first_name:
 *                       type: string
 *                       example: "satrio"
 *                     last_name:
 *                       type: string
 *                       example: "ananda"
 *                     profile_image:
 *                       type: string
 *                       example: "https://example.com/path/to/profile-image.jpg"
 *       400:
 *         description: Invalid file format or no file uploaded
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
 *                   example: "Format Image tidak sesuai"
 *                 data:
 *                   type: null
 *                   example: null
 */

const uploadProfile = async (request) => {
  try {
    const baseURL = getBaseURL(); 
    const email = request.user.email;
    if (!request.file) {
      throw new ResponseError(400, 102, "Field file tidak boleh kosong");
    }

    const allowedMimeTypes = ["image/jpeg", "image/png"];
    if (!allowedMimeTypes.includes(request.file.mimetype)) {
      throw new ResponseError(400, 102, "Format image tidak sesuai.");
    }

    const profileImagePath = `${email}-${request.file.originalname}`;

    // --------- ORM Ver ------------
    // const result = await prismaClient.membership.update({
    //   where: {
    //     email: email,
    //   },
    //   data: {
    //     profile_image: profileImagePath,
    //   },
    //   select: {
    //     email: true,
    //     first_name: true,
    //     last_name: true,
    //     profile_image: true,
    //   },
    // });

    // --------- Manual Query Ver ------------
    await prismaClient.$queryRaw`
      UPDATE memberships SET profile_image = ${profileImagePath} WHERE email = ${email}
    `;

    const result = await prismaClient.$queryRaw`
      SELECT email, first_name, last_name, profile_image FROM memberships WHERE email = ${email} LIMIT 1
    `;

    return {
      status: 0,
      message: "Upload profile berhasil",
      data: Array.isArray(result)
        ? {
            ...result[0],
            profile_image_url: `${baseURL}/${result[0].profile_image}`,
          }
        : result,
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      throw error;
    } else {
      throw new ResponseError(500, 105, "Gagal mengupload profile image");
    }
  }
};

const registerList = async () => {
  const result = await prismaClient.membership.findMany({
    select: { email: true, first_name: true, last_name: true },
  });

  return {
    status: 0,
    message: "List membership",
    data: result,
  };
};

export default {
  register,
  registerList,
  login,
  update,
  profile,
  uploadProfile,
};
