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
  buttonBorder: '2px solid #fff',
  tabPanelBorder: '1px solid darkgrey',
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
};

const dateDefault = {
  // Must use this format to do search, we do not care about the time
  DATE_TIME_FORMAT: 'YYYY-MM-DDT00:00:00[Z]',
  min: new Date('01/01/1970'),
  max: new Date()
};

const pageDefault = {
  search: '/search',
  details: '/details',
  landing: '/'
}

const zIndex = {
  MAP_COORD: 1,
  FILTER_OVERLAY: 2
}

export {
  margin,
  border,
  borderRadius,
  filterList,
  zIndex,
  dateDefault,
  pageDefault
}