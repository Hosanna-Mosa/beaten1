// Dummy Upload API - Replaces backend calls with dummy data
import { dummyDataAPI } from "./dummyData";

export const uploadAdminAPI = {
  uploadImage: (file) => {
    console.log("Uploading file:", file);
    return dummyDataAPI.upload.uploadImage(file);
  },
};
