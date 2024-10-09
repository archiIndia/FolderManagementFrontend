

const fileUpload = async ({ payload = {}, files = null }) => {
    const formData = new FormData();
    // Append files to FormData
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }
    // Append JSON data as a string
    if (payload && Object.keys(payload).length > 0) {
      formData.append('json_string', JSON.stringify({ ...payload }));
    }
    try {
      const response = await fetch('/upload-endpoint', { // Replace with your upload URL
        method: 'POST',
        body: formData,
      });
     console.log(response);
      if (response.data.success) {
        // return response.data;
      }
    } catch (error) {
        throw new Error("Can not post data");
    }
 
  }

export {fileUpload};
