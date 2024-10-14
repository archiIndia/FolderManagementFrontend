const fileUpload = async (formData) => {
  console.log("fo", formData);
  
  try {
    const response = await fetch("/upload-endpoint", {
      method: "POST",
      body: formData,
    });
    console.log(response);

    return response?.statusText;
  } catch (error) {
    throw new Error("Can not post data");
  }
};

export { fileUpload };
