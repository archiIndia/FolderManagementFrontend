const fileUpload = async (formData) => {
  console.log("fD", formData);
  try {
    const response = await fetch("http://localhost:5000/files/", {
      method: "POST",
      body: formData,
    });
    // console.log(response);
    if (!response.ok) {
      throw new Error('File upload failed');
    }
    return await response.json();
  } catch (error) {
    throw new Error("Can not post data");
  }
};

export { fileUpload };
