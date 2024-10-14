const fileUpload = async (files) => {
  console.log("fo", files);
  if (files.length === 0) {
    alert("Please select a file!");
    return;
  }
  const formData = new FormData();
  // Append files to FormData
  if (files) {
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
  }
  // Append JSON data as a string
  // if (payload && Object.keys(payload).length > 0) {
  //   formData.append('json_string', JSON.stringify({ ...payload }));
  // }
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
