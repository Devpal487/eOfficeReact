
export function getISTDate() {
  const someDate = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;

  const istDate = new Date(someDate.getTime() + istOffset);

  const defaultValues = istDate.toISOString().split("T")[0];
  const defaultValuestime = istDate.toISOString();

  return {
      defaultValues,
      defaultValuestime,
  };
}


export function getId() {
  let ID = localStorage.getItem("useR_ID");
  if (ID !== null) {
    ID = ID.replace(/\D/g, ''); 
  }
  return ID;
}

export function getdivisionId(){
  let divId = localStorage.getItem("id");
  return divId;
}

export function getinstId(){
  let instId = localStorage.getItem("inst_id");
  return instId;
}