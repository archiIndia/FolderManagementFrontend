
const base_URL= 'http://localhost:5000/api';

const createFolder = async(data) => {
  try {
    const payload = {
      name: data.name,
      userId: 1,
      parentFolderId: data.parentFolderId,
    };
    const response= await fetch(`${base_URL}/folders`,{method:'post',body: JSON.stringify(payload)});
    const data= await response.json();
    console.log('data',data);
    return data;
  } catch (err) {
    throw new Error('Can not create');
  }
};

const getParentFolders= async()=> {
  try{
     await fetch(`${base_URL}/folders/parent/0`,{method:'GET'}) .then(response => response.json())
    .then(data => console.log(data));
  }
  catch(error){
  throw new Error('Parent Folder does not exist');
}
};

export {createFolder,getParentFolders};
