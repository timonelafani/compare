import React from "react";
import "../App.css";
import * as XLSX from "xlsx";
import Table from "./Table";
import { Box, Button, Grid, IconButton } from "@material-ui/core";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";

class ExcelToJson extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      file: "",
      file2: "",
      fileOne: [],
      fileTwo: [],
      tableData: [],
      data: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("here");
    if (prevState.tableData !== this.state.tableData) {
      console.log("also here");
      this.setState({
        data: [...this.state.tableData],
      });
    }
  }

  handleClick(e) {
    this.refs.fileUploader.click();
  }

  filePathset(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    this.setState({ file });
  }

  filePathset2(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    this.setState({ file2: file });
  }

  readFile() {
    var f = this.state.file;
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      //   console.log("Data>>>" + data);// shows that excel data is read
      // console.log(this.convertToJson(data));
      // shows data in json format
      this.convertToJson(data);
    };
    reader.readAsBinaryString(f);
  }

  readFile2() {
    var f = this.state.file2;
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      //   console.log("Data>>>" + data);// shows that excel data is read
      // console.log(this.convertToJson2(data));
      // shows data in json format
      this.convertToJson2(data);
    };
    reader.readAsBinaryString(f);
  }

  convertToJson(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    this.setState({ fileOne: result });

    // console.log(result);

    // return JSON.stringify(result); //JSON
  }

  convertToJson2(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    this.setState({ fileTwo: result });

    // console.log(result);
    // return JSON.stringify(result); //JSON
  }
  compare = () => {
    let arrOfData = [];
    this.state.fileOne.map((el, i) => {
      if (JSON.stringify(el) !== JSON.stringify(this.state.fileTwo[i])) {
        arrOfData.push(el);
        arrOfData.push(this.state.fileTwo[i]);
      }
    });
    this.setState({
      tableData: [...this.state.tableData, ...arrOfData],
    });
  };

  render() {
    return (
      <Box my={3}>
        <Grid container>
          <Grid item xs={12}>
            <IconButton onClick={() => this.fileUpload.click()}>
              <CloudDownloadTwoToneIcon
                style={{
                  color: this.state.fileOne.length > 0 ? "green" : "blue",
                }}
              />
            </IconButton>
            <input
              type="file"
              id="file"
              ref="fileUploader"
              onChange={this.filePathset.bind(this)}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              ref={(fileUpload) => {
                this.fileUpload = fileUpload;
              }}
              style={{ visibility: "hidden", width: "30px" }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!this.state.file}
              onClick={() => {
                this.readFile();
              }}
            >
              Read File 1
            </Button>
          </Grid>
          <Grid item xs={12}>
            <IconButton onClick={() => this.fileUpload2.click()}>
              <CloudDownloadTwoToneIcon
                style={{
                  color: this.state.fileTwo.length > 0 ? "green" : "blue",
                }}
              />
            </IconButton>
            <input
              type="file"
              id="file"
              ref="fileUploader2"
              onChange={this.filePathset2.bind(this)}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              ref={(fileUpload2) => {
                this.fileUpload2 = fileUpload2;
              }}
              style={{ visibility: "hidden", width: "30px" }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={!this.state.file2}
              onClick={() => {
                this.readFile2();
              }}
            >
              Read File 2
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              disabled={
                !this.state.fileOne.length && !this.state.fileTwo.length
              }
              onClick={() => {
                this.compare();
              }}
            >
              Compare
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Table data={this.state.data} />
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default ExcelToJson;
