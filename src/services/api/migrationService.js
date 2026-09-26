import { getAuthToken } from "./cookies";
import { URL, apiError, responseValidator } from "./helper";

const postMigrationFile = async (path, file, isToaster = false) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch(`${URL}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${await getAuthToken()}` },
      body: formData,
    });
    return responseValidator(res, isToaster);
  } catch (error) {
    return apiError(error);
  }
};

export const previewClientsMigration = (file) =>
  postMigrationFile("admin/migrations/clients/preview", file, false);

export const commitClientsMigration = (file) =>
  postMigrationFile("admin/migrations/clients/commit", file, true);

export const previewPortfolioMigration = (file) =>
  postMigrationFile("admin/migrations/portfolio/preview", file, false);

export const commitPortfolioMigration = (file) =>
  postMigrationFile("admin/migrations/portfolio/commit", file, true);
