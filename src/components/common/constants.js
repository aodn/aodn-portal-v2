import grey from "./colors/grey";

const margin = {
  top: '15px',
  bottom: '15px',
  left: '15px',
  right: '15px',
  doubleTop: '30px',
  doubleBottom: '30px',
  tripleTop: '45px',
  tripleBottom: '45px'
};

const border = {
  frameBorder: '5px solid #fff',
  buttonBorder: '2px solid #fff',
  listFilterBorder: '2px solid ' + grey['filterGroup']
}

const borderRadius = {
  circle: '50%',
  underline: '24px',
  button: '24px',
  filter: '10px'
}

const filterList = {
  filterListMaxDisplay: 4
}

const dateDefault = {
  min: new Date('01/01/1970'),
  max: new Date()
}

export {
  margin,
  border,
  borderRadius,
  filterList,
  dateDefault
}