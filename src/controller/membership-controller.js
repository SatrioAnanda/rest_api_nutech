import membershipService from "../service/membership-service.js";

const register = async (request, response, next) => {
  try {
    const result = await membershipService.register(request.body);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const registerList = async (request, response, next) => {
  try {
    const result = await membershipService.registerList();
    response.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (request, response, next) => {
  try {
    const result = await membershipService.login(request.body);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const profile = async (request, response, next) => {
  try {
    const result = await membershipService.profile(request);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (request, response, next) => {
  try {
    const email = request.user.email;
    const req = request.body;
    req.email = email;
    const result = await membershipService.update(req);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const uploadProfile = async (request, response, next) => {
  try {
    const result = await membershipService.uploadProfile(request);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { register, registerList, login, profile, update, uploadProfile };
