import bannerService from "../service/banner-service.js";

const bannerList = async (request, response, next) => {
  try {
    const result = await bannerService.bannerList(request.body);
    response.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { bannerList };
