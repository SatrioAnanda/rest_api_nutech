import { prismaClient } from "../application/database.js";

const generateInvoiceNumber = async () => {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); 

  // ------- ORM Ver -------
  //   const lastInvoice = await prismaClient.transaction.findFirst({
  //     where: {
  //       invoice_number: {
  //         startsWith: "INV" + dateStr, 
  //       },
  //     },
  //     orderBy: {
  //       invoice_number: "desc", 
  //     },
  //   });

  // ------- Manual Query Ver -------
  const lastInvoice =
    await prismaClient.$queryRaw`SELECT invoice_number FROM transactions WHERE invoice_number LIKE ${`INV${dateStr}%`} ORDER BY invoice_number DESC LIMIT 1`;

  const sequentialNumber =
    lastInvoice && lastInvoice.length > 0
      ? parseInt(lastInvoice[0].invoice_number.slice(-3)) + 1
      : 1;

  const formattedSequentialNumber = sequentialNumber
    .toString()
    .padStart(3, "0");

  return `INV${dateStr}-${formattedSequentialNumber}`;
};

export { generateInvoiceNumber };
