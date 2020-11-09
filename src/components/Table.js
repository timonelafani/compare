import React from "react";
import "../Table.css";
import { makeStyles } from "@material-ui/core/styles";
import TableMaterial from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    margin:"30px 0"
  },
});

const Table = (props) => {
  const classes = useStyles();
  const [data, setData] = React.useState(props.data);

  React.useEffect(() => {
    setData(props.data);
    console.log(props.data);
  }, [props.data]);

  console.log(props.data);

  return (
    <TableContainer component={Paper}>
      {data.length > 0 ? (
        <TableMaterial className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {data.length > 0 &&
                Object.keys(data[0]).map((el, i) => (
                  <TableCell key={i}>{el}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.map((obj, i) => (
                <TableRow key={i}>
                  {Object.values(obj).map((el, i) => (
                    <TableCell key={el}>{el}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </TableMaterial>
      ) : (
        <TableMaterial className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>No data</TableRow>
          </TableHead>
        </TableMaterial>
      )}
    </TableContainer>
  );
};

export default Table;
