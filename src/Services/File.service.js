const base_URL = "http://localhost:5000/files/";

const fileUpload = async (formData) => {
  console.log("fD", formData);
  try {
    const response = await fetch(base_URL, {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("File upload failed.");
    }
    return await response.json();
  } catch (error) {
    throw new Error("Can not post data.");
  }
};

const getFileById = async (id) => {
  try {
    const response = await fetch(`${base_URL}${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create folder: ${errorData.message || response.status}`
      );
    }
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Parent Folder does not exist");
  }
};

export { fileUpload, getFileById, base_URL };
