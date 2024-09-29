
const isEmpty= (val)=>{
    return val=== undefined || val=== null || val=== "" || Object.keys(val).length ===0 || val.length ===0;
}

const isNotEmpty= (val)=>{
    return !isEmpty(val);
}

export {isEmpty,isNotEmpty};