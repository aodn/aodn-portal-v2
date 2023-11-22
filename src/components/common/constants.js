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
};

const dateDefault = {
  min: new Date('01/01/1970'),
  max: new Date()
};

/**
 * Common filter for cql, avoid cql string repeat everywhere
 * @type {{}}
 */
const cqlDefaultFilters = new Map();
cqlDefaultFilters
  .set('IMOS_ONLY', 'providers like \'%IMOS%\'')
  .set('ALL_TIME_RANGE','temporal after 1970-01-01T00:00:00Z');

export {
  margin,
  border,
  borderRadius,
  filterList,
  dateDefault,
  cqlDefaultFilters
}