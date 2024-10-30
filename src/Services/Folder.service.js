const base_URL = "http://localhost:5000/folders/";

const createFolder = async ({ payload }) => {
  try {
    const response = await fetch(base_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
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

const getFoldersWithFiles = async (folder_id) => {
  try {
    if (folder_id === "root") {
      const response = await fetch(`${base_URL}${folder_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create folder: ${errorData.message || response.status}`);
      }
      const data = await response.json();
      return data;
    } else {
      const response = await fetch(`${base_URL}${folder_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create folder: ${errorData.message || response.status}`);
      }
      const data = await response.json();
      return data;
    }
  } catch (error) {
    throw new Error("Parent Folder does not exist.");
  }
};

const getTreeFolders = async () => {
  try {
    const response = await fetch(base_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create folder: ${errorData.message || response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("No root folders exist.");
  }
};

const updateFolder= async({payload, folderId})=>{
  try{
    const response = await fetch(`${base_URL}${folderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("Token")}`,
      },
      body: JSON.stringify({payload,folderId}),
    });
    console.log('response',response)

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Server error: ${errorData}`);
    }
    const data = await response.json();
    return data;
  }catch(error){
    throw new Error(`OM Shanti${error}`);
  }
};

export { createFolder, getFoldersWithFiles, getTreeFolders, updateFolder };
