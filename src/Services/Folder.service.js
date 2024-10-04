const base_URL = "http://localhost:5000/folders";

const createFolder = async ({ payload }) => {
  try {
    const response = await fetch(`${base_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create folder: ${errorData.message || response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Cannot create folder: ${err.message}`);
  }
};

const getParentFolders = async (folder_id) => {
  try {
    const response= await fetch(`${base_URL}/parent/${folder_id}`, { method: "GET" })
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create folder: ${errorData.message || response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Parent Folder does not exist");
  }
};

export { createFolder, getParentFolders };
