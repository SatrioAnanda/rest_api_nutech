import membershipService from "../service/membership-service.js";
import transactionService from "../service/transaction-service.js";

const balance = async (request, response, next) => {
  try {
    const result = await transactionService.balance(request);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const topUp = async (request, response, next) => {
  try {
    const email = request.user.email;
    const req = request.body;
    req.email = email;
    const result = await transactionService.topUp(req);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const purchase = async (request, response, next) => {
  try {
    const email = request.user.email;
    const req = request.body;
    req.email = email;
    const result = await transactionService.purchase(req);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const purchaseHistory = async (request, response, next) => {
  try {
    const result = await transactionService.purchaseHistory(request);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { balance, topUp, purchase, purchaseHistory };
