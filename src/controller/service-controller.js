import serviceService from "../service/service-service.js";

const serviceList = async (request, response, next) => {
  try {
    const result = await serviceService.serviceList(request.body);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { serviceList };
