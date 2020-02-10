//this will load data from csv file
d3.csv("data.csv", convertRow).then(drawBarChart);
d3.csv("data.csv", convertRow).then(drawLineChart);
let parseColumnName = d3.timeParse('%Y%m');

//convert row will change datatype of each row to data we want.
// map will convert array of objects and convert into one array of field specified
function convertRow(row, index)
{
  let out = {};
  out.num = 0;
  out.date = new Date();
  for(let col in row) {
    switch (col) {
      case 'GEO_Region':
      // case 'GEO_Summary':
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
        // these should be our time series values
      // default:
      //   // convert column name into the date
      //   var date = col;
      //   // convert the value to float
      //   var value = parseColumnName(row[col]).getMonth();
      //   // add them to our values
      //   out.values.push({
      //     'date': date,
      //     'value': value
      //   });
      }
  }
  return out;
}
