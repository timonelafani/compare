import React from "react";
import "../App.css";
import * as XLSX from "xlsx";
import Table from "./Table";
import { Box, Button, Grid, IconButton } from "@material-ui/core";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";
import groupBy from "lodash.groupby";
import uniq from "lodash.uniq";
import difference from "lodash.difference";

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

    for (var i = 1; i < lines.length - 1; i++) {
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

    for (var i = 1; i < lines.length - 1; i++) {
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
    var result = groupBy(this.state.fileOne, "Device Name");
    var result1 = groupBy(this.state.fileTwo, "Device Name");
    //File one
    var arrEl = [];
    Object.values(result).forEach((arr) => {
      let value = [];
      let name;
      arr.map((el) => {
        value = [...value, el["Application Name"]];
        name = el["Device Name"];
      });
      arrEl = [...arrEl, { name: name, value: value }];
    });
    console.log(arrEl);
    //File two
    var arrEl1 = [];
    Object.values(result1).forEach((arr1) => {
      let value1 = [];
      let name1;
      arr1.map((el1) => {
        value1 = [...value1, el1["Application Name"]];
        name1 = el1["Device Name"];
      });
      arrEl1 = [...arrEl1, { name: name1, value: value1 }];
    });
    console.log(arrEl1);
    let devicesNames = [];
    arrEl.map((elem) => (devicesNames = [...devicesNames, elem.name]));
    arrEl1.map((elem1) => (devicesNames = [...devicesNames, elem1.name]));
    const uniqueNames = uniq(devicesNames);
    const file1ByName = groupBy(arrEl, "name");
    const file2ByName = groupBy(arrEl1, "name");
    let diffValues = [];
    uniqueNames.map((name) => {
      if (
        file1ByName.hasOwnProperty(name) &&
        file2ByName.hasOwnProperty(name)
      ) {
        let unique1 = file1ByName[name][0].value.filter(
          (o) => file2ByName[name][0].value.indexOf(o) === -1
        );
        let unique2 = file2ByName[name][0].value.filter(
          (o) => file1ByName[name][0].value.indexOf(o) === -1
        );

        const unique = unique1.concat(unique2);
        diffValues = [...diffValues, { name: name, value: unique }];
      }
    });
    const notFinal = diffValues.filter((diffVl) => diffVl.value.length > 0);
    let data = [];
    notFinal.map((dt) => {
      dt.value.map((vl) => (data = [...data, { 'Device Name': dt.name, 'Application Name': vl }]));
    });
    console.log(data);
    this.setState({ data: data });
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
                !this.state.fileOne.length || !this.state.fileTwo.length
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
