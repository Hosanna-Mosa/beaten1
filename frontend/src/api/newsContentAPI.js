import axios from "axios";
import {
  API_ENDPOINTS,
  buildApiUrl,
  handleApiResponse,
  handleApiError,
} from "../utils/api";

const api = axios.create({
  baseURL: buildApiUrl(""),
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchNewsContent = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.NEWS_CONTENT(id));
    return handleApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchSlideImages = async (id) => {
  try {
    const response = await api.get(API_ENDPOINTS.SLIDE_IMAGES(id));
    return handleApiResponse(response);
  } catch (error) {
    throw handleApiError(error);
  }
};


export const fetchMobileSlideImages = async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.MOBIEL_SLIDE_IMAGES(id));
      return handleApiResponse(response);
    } catch (error) {
      throw handleApiError(error);
    }
  };