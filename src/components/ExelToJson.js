import React from "react";
import "../App.css";
import * as XLSX from "xlsx";
import Table from "./Table";
import { Box, Button, Grid, IconButton } from "@material-ui/core";
import CloudDownloadTwoToneIcon from "@material-ui/icons/CloudDownloadTwoTone";
import groupBy from "lodash.groupby";
import uniq from "lodash.uniq";
import sortBy from "lodash.sortby";
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
      addedOrRemoved: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("here");
    if (prevState.tableData !== this.state.tableData) {
      // console.log("also here");
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
    var groupByFirstFile = groupBy(this.state.fileOne, "Device Name");
    var groupBySecondFile = groupBy(this.state.fileTwo, "Device Name");

    //File one
    var arrOfElementsFistFile = [];
    Object.values(groupByFirstFile).forEach((arrFirst) => {
      let value = [];
      let name;
      let rest;
      arrFirst.map((el) => {
        value = [...value, el["Application Name"]];
        name = el["Device Name"];
        rest = el;
      });
      arrOfElementsFistFile = [
        ...arrOfElementsFistFile,
        { name: name, value: value, ...rest },
      ];
    });
    // console.log(arrOfElementsFistFile);

    //File two
    var arrOfElementsSecondFile = [];
    Object.values(groupBySecondFile).forEach((arrSecond) => {
      let value = [];
      let name;
      let rest;
      arrSecond.map((el) => {
        value = [...value, el["Application Name"]];
        name = el["Device Name"];
        rest = el;
      });
      arrOfElementsSecondFile = [
        ...arrOfElementsSecondFile,
        { name: name, value: value, ...rest },
      ];
    });
    // console.log(arrOfElementsSecondFile);

    // Get all device names
    let devicesNames = [];
    arrOfElementsFistFile.map(
      (elem) => (devicesNames = [...devicesNames, elem.name])
    );
    arrOfElementsSecondFile.map(
      (elem1) => (devicesNames = [...devicesNames, elem1.name])
    );

    // Unique device names
    const uniqueNames = uniq(devicesNames);

    // Group by name to find the differences of names on each file
    const groupByNameFirst = groupBy(arrOfElementsFistFile, "name");
    const groupByNameSecond = groupBy(arrOfElementsSecondFile, "name");
    // Save here if it has chnaged
    let diffValues = [];
    let arrOfElWithAllValues = [];
    let addedOrRemoved = [];
    let allEl1 = [];
    let allEl2 = [];
    let allEl = this.state.fileOne.concat(this.state.fileTwo);
    // Save here if is removed or added
    // let otherValues = [];
    uniqueNames.map((name) => {
      if (
        groupByNameFirst.hasOwnProperty(name) &&
        groupByNameSecond.hasOwnProperty(name)
      ) {
        let unique1 = groupByNameFirst[name][0].value.filter(
          (o) => groupByNameSecond[name][0].value.indexOf(o) === -1
        );

        unique1.map((unq1) => {
          const filtered1 = allEl.filter(
            (all1) =>
              all1["Device Name"] === name && all1["Application Name"] === unq1
          );
          allEl1 = [...allEl1, { ...filtered1[0], added: false }];
        });
        // console.log(allEl1);

        // arrOfEl1 = arrOfEl1.push(groupByNameFirst[unique1]);

        let unique2 = groupByNameSecond[name][0].value.filter(
          (o) => groupByNameFirst[name][0].value.indexOf(o) === -1
        );
        unique2.map((unq2) => {
          const filtered2 = allEl.filter(
            (all2) =>
              all2["Device Name"] === name && all2["Application Name"] === unq2
          );
          allEl2 = [...allEl2, { ...filtered2[0], added: true }];
        });
        // arrOfEl2 = arrOfEl2.push(groupByNameFirst[unique2])
        arrOfElWithAllValues = [...allEl1, ...allEl2];

        // const unique = unique1.concat(unique2);

        // diffValues = [...diffValues, { name: name, value: unique }];
        // console.log(diffValues)
      } else if (
        groupByNameFirst.hasOwnProperty(name) &&
        !groupByNameSecond.hasOwnProperty(name)
      ) {
        console.log("removed", name);
        const removed = allEl.filter((all3) => all3["Device Name"] === name);
        addedOrRemoved = [...addedOrRemoved, { ...removed[0], added: false }];
      } else if (
        !groupByNameFirst.hasOwnProperty(name) &&
        groupByNameSecond.hasOwnProperty(name)
      ) {
        console.log("added", name);
        const added = allEl.filter((all4) => all4["Device Name"] === name);
        addedOrRemoved = [...addedOrRemoved, { ...added[0], added: true }];
      }
    });
    console.log(addedOrRemoved);

    console.log(sortBy(arrOfElWithAllValues, "Device Name"));
    this.setState({ data: sortBy(arrOfElWithAllValues, "Device Name") });
    this.setState({ addedOrRemoved: addedOrRemoved });

    // const notFinal = diffValues.filter((diffVl) => diffVl.value.length > 0);
    // let data = [];
    // notFinal.map((dt) => {
    //   dt.value.map(
    //     (vl) =>
    //       (data = [...data, { "Device Name": dt.name, "Application Name": vl }])
    //   );
    // });

    // console.log(data);
    // Set data for the table
    // this.setState({ data: data });
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
          {this.state.addedOrRemoved.length > 0 ? (
            <>
              <h5>Added or removed completely</h5>
              <Grid item xs={12}>
                <Table data={this.state.addedOrRemoved} />
              </Grid>
            </>
          ) : null}
        </Grid>
      </Box>
    );
  }
}

export default ExcelToJson;
