//this will load data from csv file
let parseColumnName = d3.timeParse('%Y%m');

function convertRow(row, index)
{
  let out = {};
  out.num = 0;
  out.date = new Date();
  for(let col in row) {
    switch (col) {
      case 'GEO_Region':
      case 'GEO_Summary':
      case 'Terminal':
      // case 'Boarding_Area':
        out[col] = row[col];
        break;
      case 'Passenger_Count':
        out.num = +(row[col]);
        break;
      case 'Activity_Period':
        out.date = parseColumnName(row[col]);
        break;
      }
  }
  return out;
}
