// PUT

export const updatePolicy = async (payload) => {
  try {
    const res = await fetch(`${URL}policy/updatepolicy`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    apiError(error);
  }
};
