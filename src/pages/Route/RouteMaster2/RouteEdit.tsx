import * as React from "react";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  TextField,
  CardContent,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import ToastApp from "../../../ToastApp";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import api from "../../../utils/Url";
import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
import auth from "../../../assets/images/authority.png";
import comm from "../../../assets/images/committee.png";
import grp from "../../../assets/images/group.png";
import { getISTDate } from "../../../utils/Constant";
import { toast } from "react-toastify";
import CustomLabel from "../../../CustomLable";

export default function RouteEdit() {
  console.log("useLocation " + useLocation());
  const location = useLocation();
  console.log("location", location.state);
  const back = useNavigate();
  let navigate = useNavigate();

  const { i18n, t } = useTranslation();
  const { defaultValues, defaultValuestime } = getISTDate();
  const [fileOption, setFileOption] = useState([
    { value: "-1", label: t("text.FileType") },
  ]);
  const [departmentOption, setDepartmentOption] = useState([
    { value: "-1", label: t("text.FileType") },
  ]);
  const [authorityOption, setAuthorityOpotion] = useState([
    { value: "-1", label: "Select Authority" },
  ]);
  const [committeeOption, setCommitteeOption] = useState([
    { value: "-1", label: "Select Committee" },
  ]);
  const [committeeGroupOption, setCommitteeGroupOption] = useState([
    { value: "-1", label: "Select Group" },
  ]);
  const [sectionOption, setSectionOption] = useState([
    { value: "-1", label: "Select Section" },
  ]);

  const [selectedValue, setSelectedValue] = useState<any>(null);
  const numberOfCards = parseInt(selectedValue);

  const [nodeType, setNodeType] = useState<any>([
    { value: 1, label: "Authority" },
  ]);
  const [nodeTypetemp, setNodeTypetemp] = useState<any>([
    { value: 1, label: "Authority" },
  ]);
  const nodeTypeOptions = [
    { value: 1, label: "Authority", short: "A" },
    { value: 2, label: "Committee", short: "C" },
    { value: 3, label: "Group", short: "G" },
  ];

  const [isCommitteeChecked, setIsCommitteeChecked] = useState(false);
  const [isCommitteeGroupChecked, setIsCommitteeGroupChecked] = useState(false);
  const [routeMembercycles, setRouteMembercycles] = useState<any>();
  const [toaster, setToaster] = useState(false);

  useEffect(() => {
    setSelectedValue(location.state.totalLevel);
    var arr = [];
    for (let index = 0; index < location.state.routeMembercycless.length; index++) {
      const element = location.state.routeMembercycless[index];
      var tabindex = 0;
      if (element["nodeMode"] == "A") {
        tabindex = 1;
      } else if (element["nodeMode"] == "C") {
        tabindex = 2;
      } else if (element["nodeMode"] == "G") {
        tabindex = 3;
      } else {
        tabindex = 0;
      }
      element['tabindex'] = tabindex;
      element['nodeType'] = 1;
      console.log("element", element);

      arr.push(element)
      console.log("arr", arr);
    }

    //setRouteMembercycles(location.state.routeMembercycless);
    setRouteMembercycles(arr);
    getFileData();
    getDepartmentData();
    getAuthorityData();
    getCommitteeData();
    getCommitteeGroupData();
    getSectionData();
    console.log(routeMembercycles);
  }, []);

  const getFileData = async () => {
    const collectData = {
      fId: -1,
      inst_id: -1,
      user_id: -1,
      divisionid: -1,
    };

    await api.post(`FileType/GetFileType`, collectData).then((res: any) => {
      const arr: any = [];
      for (let index = 0; index < res.data.data.length; index++) {
        arr.push({
          label: res.data.data[index]["fName"],
          value: res.data.data[index]["fId"],
        });
      }
      setFileOption(arr);
    });
  };

  const getSectionData = async () => {
    const collectData = {
      id: -1,
      nodeID: -1,
      titleID: -1,
      user_Id: "",
    };

    await api
      .post(`NewNodeMaster/GetNewNodeMaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["name"],
            value: res.data.data[index]["id"],
          });
        }
        setSectionOption(arr);
      });
  };

  const getDepartmentData = async () => {
    const collectData = {
      departmentId: -1,
    };

    await api
      .post(`Department/GetDepartmentmaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["departmentName"],
            value: res.data.data[index]["departmentId"],
          });
        }
        setDepartmentOption(arr);
      });
  };

  const getAuthorityData = async () => {
    const collectData = {
      id: -1,
      officeId: -1,
      under_id: -1,
      divisionid: -1,
    };

    await api
      .post(`AuthorityMaster/GetAuthorityMaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["authorityType"],
            value: res.data.data[index]["departidmentId"],
          });
        }
        setAuthorityOpotion(arr);
      });
  };

  const getCommitteeData = async () => {
    const collectData = {
      id: -1,
      committeeName: "",
      officeId: -1,
      userId: "",
      ipAddress: "",
      type: "C",
    };

    await api
      .post(`CommitteeMaster/GetCommitteeMaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["committeeName"],
            value: res.data.data[index]["id"],
          });
        }
        setCommitteeOption(arr);
      });
  };

  const getCommitteeGroupData = async () => {
    const collectData = {
      id: -1,
      committeeName: "",
      officeId: -1,
      userId: "",
      ipAddress: "",
      type: "G",
    };

    await api
      .post(`CommitteeMaster/GetCommitteeMaster`, collectData)
      .then((res: any) => {
        const arr: any = [];
        for (let index = 0; index < res.data.data.length; index++) {
          arr.push({
            label: res.data.data[index]["committeeName"],
            value: res.data.data[index]["id"],
          });
        }
        setCommitteeGroupOption(arr);
      });
  };

  const handleCheckboxChange = (event: any) => {
    setIsCommitteeChecked(event.target.checked);
  };

  const handleCheckboxesChange = (event: any) => {
    setIsCommitteeGroupChecked(event.target.checked);
  };

  const handleNodeTypeChange = (newValue: any, cardIndex: number) => {
    const updatedNodeTypes = [...nodeType];
    updatedNodeTypes[cardIndex] = newValue?.value;
    setNodeTypetemp(newValue);
    setNodeType(updatedNodeTypes);
    var tabindex = newValue?.value;
    handleCardTabChange(newValue, cardIndex, tabindex);
  };

  const handleCardTabChange = (
    newValue: any,
    cardIndex: number,
    tabindex: number
  ) => {
    const updatedRouteMembercycless = [...routeMembercycles];
    console.log("Updated routeMembercycless:", newValue);
    console.log("Updated cardIndex:", cardIndex);
    updatedRouteMembercycless[cardIndex] = {
      ...updatedRouteMembercycless[cardIndex],

      arrivalDate: defaultValuestime,

      uploadDate: defaultValuestime,

      nodeModes: newValue?.label == "undefined" ? "Authority" : newValue?.label,
      nodeMode: newValue?.label == "undefined" ? "Authority" : newValue?.short,

      tabindex: tabindex,
      nodeType: newValue?.value == "undefined" ? 1 : newValue?.value,
    };
    console.log("Updated routeMembercycless:", updatedRouteMembercycless);
    setRouteMembercycles(updatedRouteMembercycless);
    console.log("Updated routeMembercycless:", routeMembercycles);
  };

  const formik = useFormik({
    initialValues: {
      id: location.state.id,
      routeName: location.state.routeName,
      totalLevel: location.state.totalLevel,
      officeId: 1,
      uplodDate: defaultValuestime,
      routeMembercycless: [],
    },
    onSubmit: async (values) => {
      values.routeMembercycless = routeMembercycles;
      console.log("check", values);

      const response = await api.post(
        `RouteMemberCycle/AddUpdateRouteMemberCycle`,
        values
      );
      if (response.data.isSuccess) {
        setToaster(false);
        toast.success(response.data.mesg);
        navigate('/Route/Route');
        // formik.resetForm();
        //getList();
        //setEditId("-1");
      } else {
        setToaster(true);
        toast.error(response.data.mesg);
      }
    },
  });

  const getValueLabel = (value: any) => {
    return nodeTypeOptions.find((option) => option.short === value) || "";
  };

  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    value: any
  ) => {
    formik.setFieldValue("totalLevel", value);

    var arr = Array.from({ length: value }, () => ({
      id: -1,
      authorityId: 0,
      email: "",
      sms: "",
      arrivalDate: defaultValuestime,
      message: "",
      authorityLevel: 0,
      routeId: 0,
      officeId: 1,
      uploadDate: defaultValuestime,
      subRoute: 0,
      committee: 0,
      memGroup: 0,
      nodeMode: "Authority",
      committeeOrGroupId: 0,
      auth_DeptId: 0,
      auth_SectionId: 0,
      tabindex: 1,
      nodeType: 1,
    }));

    setRouteMembercycles(arr);
    console.log("routeMembercycles onchange", routeMembercycles);
    setSelectedValue(value);
  };

  const renderCards = () => {
    if (selectedValue === null) {
      return null;
    }

    const numberOfCards = parseInt(selectedValue);

    const cards = Array.from({ length: numberOfCards }, (_, index) => (
      <Grid item xs={4} key={index}>
        <Card style={{ marginTop: "10px", backgroundColor: "#89CFF0" }}>
          <CardContent>
            <CardContent sx={{ padding: 0 }}>
              <Grid
                container
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Level {index + 1}</h2>
                <Grid xs={5} item>
                  <Autocomplete
                    disablePortal
                    disableClearable
                    id={`node-type-combo-box-${index}`}
                    fullWidth
                    size="small"
                    style={{ background: "white" }}
                    // value={getValueLabel(routeMembercycles[index]?.nodeMode)}
                    value={routeMembercycles[index]?.nodeModes}
                    options={nodeTypeOptions}
                    onChange={(event, newValue) =>
                      handleNodeTypeChange(newValue, index)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Node Type"
                      // label={getLabel(routeMembercycles[index]?.nodeMode)}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>

            <Divider />
            <br />

            <Box sx={{ bgcolor: "background.paper" }}>
              {routeMembercycles && routeMembercycles[index] && (
                <Tabs
                  value={routeMembercycles[index].tabindex || 0}
                  variant="scrollable"
                  scrollButtons={false}
                  aria-label="scrollable prevent tabs example"
                >
                  {routeMembercycles[index].nodeType === 1 && (
                    <Tab
                      label="Authority"
                      onClick={() => {
                        handleCardTabChange(
                          { value: 1, label: "Authority", short: "A" },
                          index,
                          1
                        );
                      }}
                      value={1}
                      sx={{
                        backgroundColor:
                          routeMembercycles[index].tabindex === 1
                            ? "#00009c"
                            : "inherit",
                        color:
                          routeMembercycles[index].tabindex === 1
                            ? "white"
                            : "inherit",
                      }}
                    />
                  )}
                  {routeMembercycles[index].nodeType === 2 && (
                    <Tab
                      label="Committe"
                      onClick={() => {
                        handleCardTabChange(
                          { value: 2, label: "Committe", short: "C" },
                          index,
                          2
                        );
                      }}
                      value={2}
                      sx={{
                        backgroundColor:
                          routeMembercycles[index].tabindex === 2
                            ? "#00009c"
                            : "inherit",
                        color:
                          routeMembercycles[index].tabindex === 2
                            ? "white"
                            : "inherit",
                      }}
                    />
                  )}
                  {routeMembercycles[index].nodeType === 3 && (
                    <Tab
                      label="Group"
                      onClick={() => {
                        handleCardTabChange(
                          { value: 3, label: "Group", short: "G" },
                          index,
                          3
                        );
                      }}
                      value={3}
                      sx={{
                        backgroundColor:
                          routeMembercycles[index].tabindex === 3
                            ? "#00009c"
                            : "inherit",
                        color:
                          routeMembercycles[index].tabindex === 3
                            ? "white"
                            : "inherit",
                      }}
                    />
                  )}
                  <Tab
                    label="Committe/Group Parameters"
                    onClick={() => {
                      handleCardTabChange(
                        {
                          value: 0,
                          label: "Committee/Group Parameters",
                          short: "P",
                        },
                        index,
                        0
                      );
                    }}
                    value={0}
                    sx={{
                      backgroundColor:
                        routeMembercycles[index].tabindex === 0
                          ? "#00009c"
                          : "inherit",
                      color:
                        routeMembercycles[index].tabindex === 0
                          ? "white"
                          : "inherit",
                    }}
                  />
                </Tabs>
              )}
            </Box>

            <br />
            {routeMembercycles.length > 0 && (
              <>
                {routeMembercycles[index].tabindex == 0 ? (
                  <>
                    <Grid item xs={12} container spacing={2}>
                      <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12}>
                          <Typography>
                            Authority is required to transfer file over :{" "}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography>Mode</Typography>
                        </Grid>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                          <Typography>Priority</Typography>
                        </Grid>
                      </Grid>
                      <Divider />

                      <Grid container item xs={12} gap={2}>
                        <Grid item xs={3}>
                          <FormControl component="fieldset">
                            <FormGroup aria-label="position" row>
                              <FormControlLabel
                                value="SubRoute"
                                // control={<Checkbox />}
                                control={
                                  <Checkbox
                                  // checked={
                                  //   routeMembercycles[index].subRoute !== ""
                                  // }
                                  />
                                }
                                label="Sub Route"
                                labelPlacement="end"
                              // onChange={(event: any) => formik.setFieldValue("subRoute", event.target.checked)}
                              />
                            </FormGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            id="subRoute"
                            name="subRoute"
                            size="small"
                            value={routeMembercycles[index].subRoute}
                            fullWidth
                            label="subRoute name"
                            placeholder="subRoute name"
                            style={{ background: "white" }}
                            onChange={(event: any) => {
                              routeMembercycles[index].subRoute =
                                event.target.value;
                            }}
                          />
                        </Grid>
                        <Grid xs={3} item>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            // options={ZoneOption}
                            fullWidth
                            style={{ background: "white" }}
                            size="small"
                            options={[0, 1, 2]}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Priority" />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Grid container item xs={12} gap={2}>
                        <Grid item xs={3}>
                          <FormControl component="fieldset">
                            <FormGroup aria-label="position" row>
                              <FormControlLabel
                                value="Committee"
                                control={
                                  <Checkbox onChange={handleCheckboxChange} />
                                }
                                label="Committee"
                                labelPlacement="end"
                              />
                            </FormGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          {isCommitteeChecked ? (
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={committeeOption}
                              value={committeeOption.find(
                                (opt: any) =>
                                  opt.value ===
                                  routeMembercycles[index].committee
                              )}
                              fullWidth
                              style={{ background: "white" }}
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                console.log(newValue);
                                routeMembercycles[index].committee =
                                  newValue?.value;
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Committee Name"
                                />
                              )}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              size="small"
                              label=""
                              style={{ background: "white" }}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          )}
                        </Grid>
                        <Grid xs={3} item>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            // options={ZoneOption}
                            fullWidth
                            style={{ background: "white" }}
                            size="small"
                            options={[0, 1, 2]}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Priority" />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Grid container item xs={12} gap={2}>
                        <Grid item xs={3}>
                          <FormControl component="fieldset">
                            <FormGroup aria-label="position" row>
                              <FormControlLabel
                                value="Group"
                                control={
                                  <Checkbox onChange={handleCheckboxesChange} />
                                }
                                label="Group"
                                labelPlacement="end"
                              />
                            </FormGroup>
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          {isCommitteeGroupChecked ? (
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={committeeGroupOption}
                              value={committeeGroupOption.find(
                                (opt: any) =>
                                  opt.value ===
                                  routeMembercycles[index].memGroup
                              )}
                              fullWidth
                              style={{ background: "white" }}
                              size="small"
                              onChange={(e: any, newValue: any) => {
                                console.log(newValue);
                                // formik.setFieldValue("memGroup", newValue?.value)
                                routeMembercycles[index].memGroup =
                                  newValue?.value;
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Select Group Name"
                                />
                              )}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              size="small"
                              label=""
                              style={{ background: "white" }}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          )}
                        </Grid>
                        <Grid xs={3} item>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            style={{ background: "white" }}
                            // options={ZoneOption}
                            fullWidth
                            size="small"
                            options={[0, 1, 2]}
                            renderInput={(params) => (
                              <TextField {...params} label="Select Priority" />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    {routeMembercycles[index].tabindex === 1 && (
                      <div style={{ backgroundColor: "background.paper" }}>
                        <Grid
                          item
                          xs={12}
                          container
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Grid
                            xs={6}
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                          >
                            <img src={auth} alt="Authority" height="100px" />
                          </Grid>
                          <Grid item xs={6} container spacing={1}>
                            <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={departmentOption}
                                fullWidth
                                size="small"
                                style={{ background: "white" }}
                                //value={selectedValue}
                                value={
                                  departmentOption.find(
                                    (option) =>
                                      option.value ===
                                      routeMembercycles[index].auth_DeptId
                                  ) || null
                                }
                                onChange={(e: any, newValue: any) => {
                                  //setAuthDept(newValue?.value)
                                  routeMembercycles[index].auth_DeptId =
                                    newValue?.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Department"
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                fullWidth
                                size="small"
                                options={sectionOption}
                                // value={selectedValue}
                                value={
                                  sectionOption.find(
                                    (option) =>
                                      option.value ===
                                      routeMembercycles[index].auth_SectionId
                                  ) || null
                                }
                                style={{ background: "white" }}
                                // onChange={handleAutocompleteChange}
                                onChange={(e: any, newValue: any) => {
                                  console.log("section value", newValue);
                                  //  setAuthSection(newValue?.value)
                                  routeMembercycles[index].auth_SectionId =
                                    newValue?.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Section"
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                fullWidth
                                size="small"
                                options={authorityOption}
                                value={
                                  authorityOption.find(
                                    (option) =>
                                      option.value ===
                                      routeMembercycles[index].authorityId
                                  ) || null
                                }
                                // onChange={formik.handleChange}
                                onChange={(e: any, newValue: any) => {
                                  console.log("section value", newValue);
                                  //  setAuthSection(newValue?.value)
                                  routeMembercycles[index].authorityId =
                                    newValue?.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                style={{ background: "white" }}
                                // value={selectedValue}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Select Authority"
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                          <Grid xs={6} item alignContent="center">
                            {/* <TextField
                                                    id="zoneName"
                                                    name="zoneName"
                                                    label="Employee Name"
                                                    //value={formik.values.zoneName}
                                                    placeholder="Employee Name"
                                                    style={{ background: "white" }}
                                                    size="small"
                                                    fullWidth
                                                    InputProps={{ readOnly: true }}
                                                /> */}
                            NA
                          </Grid>

                          <Grid xs={6} item alignContent="center">
                            {/* <TextField
                                                    id="zoneName"
                                                    name="zoneName"
                                                    label="Designation"
                                                    //   value={formik.values.zoneName}
                                                    placeholder="Designation"
                                                    style={{ background: "white" }}
                                                    size="small"
                                                    fullWidth
                                                    InputProps={{ readOnly: true }}
                                                /> */}
                            NA
                          </Grid>

                          <Grid item xs={12} container spacing={1}>
                            <Grid xs={4} item>
                              <FormControl component="fieldset">
                                <FormGroup aria-label="position" row>
                                  <FormLabel
                                    component="legend"
                                    defaultValue="email"
                                  >
                                    Notify by :
                                  </FormLabel>
                                  <FormControlLabel
                                    value="e"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].email =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].email = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="E-Mail"
                                    checked={
                                      routeMembercycles[index]?.email === "e"
                                    }
                                    labelPlacement="end"
                                  />

                                  <FormControlLabel
                                    value="s"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].sms =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].sms = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="SMS"
                                    checked={
                                      routeMembercycles[index]?.sms === "s"
                                    }
                                    labelPlacement="end"
                                  />
                                </FormGroup>
                              </FormControl>
                            </Grid>

                            <Grid xs={4} item>
                              <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Enter Message"
                                style={{
                                  width: "200px",
                                  fontSize: " 1.075rem",
                                  fontWeight: "400",
                                  lineHeight: "6",
                                  padding: "8px 12px",
                                  borderRadius: "4px",
                                }}
                                value={routeMembercycles[index].message}
                                onChange={(event) => {
                                  routeMembercycles[index].message =
                                    event.target.value;
                                  formik.setFieldValue(
                                    "message",
                                    event.target.value
                                  );
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                // onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    )}
                    {routeMembercycles[index].tabindex === 2 && (
                      <>
                        <Grid
                          item
                          xs={12}
                          container
                          spacing={2}
                          marginBottom={5}
                        >
                          <Grid
                            xs={6}
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                          >
                            <img src={comm} alt="Committee" height="100px" />
                          </Grid>
                          <Grid item xs={6} container spacing={2}>
                            <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={committeeOption}
                                style={{ background: "white" }}
                                fullWidth
                                value={
                                  committeeOption.find(
                                    (option) =>
                                      option.value ===
                                      routeMembercycles[index]
                                        .committeeOrGroupId
                                  ) || null
                                }
                                size="small"
                                onChange={(event: any, newValue: any) => {
                                  console.log(
                                    newValue?.value,
                                    event.target.value
                                  );
                                  routeMembercycles[index].committeeOrGroupId =
                                    newValue?.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={<span>{"Committee"}</span>}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item lg={12} xs={12}>
                              <TextField
                                id="zoneCode"
                                name="zoneCode"
                                label="Enter Description"
                                placeholder="Enter Description"
                                size="small"
                                style={{ background: "white" }}
                                fullWidth
                              />
                            </Grid>
                          </Grid>

                          <Grid item xs={12} container spacing={2}>
                            <Grid xs={4} item>
                              <FormControl component="fieldset">
                                <FormGroup aria-label="position" row>
                                  <FormLabel
                                    component="legend"
                                    defaultValue="email"
                                  >
                                    Notify by :
                                  </FormLabel>
                                  <FormControlLabel
                                    value="e"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].email =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].email = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="E-Mail"
                                    checked={
                                      routeMembercycles[index]?.email === "e"
                                    }
                                    labelPlacement="end"
                                  />

                                  <FormControlLabel
                                    value="s"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].sms =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].sms = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="SMS"
                                    checked={
                                      routeMembercycles[index]?.sms === "s"
                                    }
                                    labelPlacement="end"
                                  />
                                </FormGroup>
                              </FormControl>
                            </Grid>

                            <Grid xs={4} item>
                              <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Enter Message"
                                style={{
                                  width: "200px",
                                  fontSize: " 1.075rem",
                                  fontWeight: "400",
                                  lineHeight: "6",
                                  padding: "8px 12px",
                                  borderRadius: "4px",
                                }}
                                value={routeMembercycles[index].message}
                                onChange={(event: any) => {
                                  routeMembercycles[index].message =
                                    event.target.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                              />
                            </Grid>

                            {/* </Grid> */}
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {routeMembercycles[index].tabindex === 3 && (
                      <>
                        <Grid
                          item
                          xs={12}
                          container
                          spacing={2}
                          marginBottom={5}
                        >
                          <Grid
                            xs={6}
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                          >
                            <img src={grp} alt="Group" height="50px" />
                          </Grid>
                          <Grid item xs={6} container spacing={2}>
                            <Grid item lg={12} xs={12}>
                              <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={committeeGroupOption}
                                fullWidth
                                value={
                                  committeeGroupOption.find(
                                    (option) =>
                                      option.value ===
                                      routeMembercycles[index].memGroup
                                  ) || null
                                }
                                size="small"
                                onChange={(event: any, newValue: any) => {
                                  console.log(newValue?.value);
                                  routeMembercycles[index].memGroup =
                                    newValue?.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                                style={{ background: "white" }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label={<span>{"Select Group"}</span>}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item lg={12} xs={12}>
                              <TextField
                                id="zoneCode"
                                name="zoneCode"
                                label="Enter Description"
                                style={{ background: "white" }}
                                placeholder="Enter Description"
                                size="small"
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={12} container spacing={2}>
                            <Grid xs={4} item>
                              <FormControl component="fieldset">
                                <FormGroup aria-label="position" row>
                                  <FormLabel
                                    component="legend"
                                    defaultValue="email"
                                  >
                                    Notify by :
                                  </FormLabel>
                                  <FormControlLabel
                                    value="e"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].email =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].email = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="E-Mail"
                                    checked={
                                      routeMembercycles[index]?.email === "e"
                                    }
                                    labelPlacement="end"
                                  />

                                  <FormControlLabel
                                    value="s"
                                    control={
                                      <Checkbox
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            routeMembercycles[index].sms =
                                              event.target.value;
                                          } else {
                                            routeMembercycles[index].sms = "";
                                          }
                                          handleCardTabChange(
                                            nodeTypetemp,
                                            index,
                                            routeMembercycles[index].tabindex
                                          );
                                        }}
                                      />
                                    }
                                    label="SMS"
                                    checked={
                                      routeMembercycles[index]?.sms === "s"
                                    }
                                    labelPlacement="end"
                                  />
                                </FormGroup>
                              </FormControl>
                            </Grid>

                            <Grid xs={4} item>
                              <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Enter Message"
                                style={{
                                  width: "200px",
                                  fontSize: " 1.075rem",
                                  fontWeight: "400",
                                  lineHeight: "6",
                                  padding: "8px 12px",
                                  borderRadius: "4px",
                                }}
                                value={routeMembercycles[index].message}
                                onChange={(event) => {
                                  routeMembercycles[index].message =
                                    event.target.value;
                                  handleCardTabChange(
                                    nodeTypetemp,
                                    index,
                                    routeMembercycles[index].tabindex
                                  );
                                }}
                              />
                            </Grid>

                            {/* </Grid> */}
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    ));

    return (
      <Grid container spacing={2}>
        {cards}
      </Grid>
    );
  };

  return (
    <div>
      <div
        style={{
          padding: "-5px 5px",
          backgroundColor: "#ffffff",
          borderRadius: "5px",
          //   border: ".5px solid #FF7722",
          marginTop: "3vh",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            style={{ fontSize: "18px", fontWeight: 500 }}
          >
            Edit Route
          </Typography>

          <Grid item sm={4} xs={12}>
            <Typography style={{ marginTop: "-75px" }}>
              <Button
                type="submit"
                onClick={() => back(-1)}
                variant="contained"
                style={{
                  marginBottom: 15,
                  marginTop: "45px",
                  backgroundColor: "blue",
                  width: 20,
                }}
              >
                <ArrowBackSharpIcon />
              </Button>
            </Typography>
          </Grid>
          <Divider />
          <br />

          <form onSubmit={formik.handleSubmit}>
            {toaster === false ? "" : <ToastApp />}
            <Grid item xs={12} container spacing={3}>
              <Grid xs={5} item>
                <TextField
                  id="routeName"
                  name="routeName"
                  label={<CustomLabel text={t("text.EnterRouteName")} />}
                  placeholder="Enter Route Name"
                  size="small"
                  value={formik.values.routeName}
                  style={{ background: "white" }}
                  fullWidth
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid xs={5} item>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  fullWidth
                  size="small"
                  options={[1, 2, 3, 4, 5, 6, 7]}
                  value={selectedValue}
                  onChange={handleAutocompleteChange}
                  renderInput={(params) => (
                    <TextField {...params} label={<CustomLabel text={t("text.SelectLevel")} />} />
                  )}
                />
              </Grid>
              <Grid item xs={12} container>
                {renderCards()}
              </Grid>
              <Grid item xs={2}>
                {/*  {permissionData?.isAdd == true ? ( */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                >
                  {t("text.save")}
                </Button>
                {/* ) : ( */}
                {/*   "" */}
                {/* )} */}
              </Grid>
            </Grid>
          </form>
        </CardContent>
        <ToastApp />
      </div>
    </div>
  );
}

// import * as React from "react";
// import { useEffect, useState } from "react";
// import {
//     Autocomplete,
//     Box,
//     Button,
//     Divider,
//     TextField,
//     CardContent,
//     Typography,
//     Tab, Tabs,
// } from "@mui/material";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import { useTranslation } from "react-i18next";
// import ToastApp from "../../../ToastApp";
// import Checkbox from '@mui/material/Checkbox';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import { TextareaAutosize } from "@mui/base/TextareaAutosize";
// import api from "../../../utils/Url";
// import ArrowBackSharpIcon from "@mui/icons-material/ArrowBackSharp";
// import auth from '../../../assets/images/authority.png'
// import comm from '../../../assets/images/committee.png'
// import grp from '../../../assets/images/group.png'
// import { getISTDate } from "../../../utils/Constant";

// export default function RouteAdd() {

//     console.log("useLocation " + useLocation());
//     const location = useLocation();
//     console.log("location", location.state);

//     const back = useNavigate();
//     const { t } = useTranslation();
//     const { defaultValuestime } = getISTDate();
//     const [fileOption, setFileOption] = useState([{ value: "-1", label: t("text.FileType") }]);
//     const [departmentOption, setDepartmentOption] = useState([{ value: "-1", label: t("text.FileType") }]);
//     const [authorityOption, setAuthorityOpotion] = useState([{ value: "-1", label: "Select Authority" }]);
//     const [committeeOption, setCommitteeOption] = useState([{ value: "-1", label: "Select Committee" }]);
//     const [committeeGroupOption, setCommitteeGroupOption] = useState([{ value: "-1", label: "Select Group" }]);
//     const [sectionOption, setSectionOption] = useState([{ value: "-1", label: "Select Section" }]);

//     const [selectedValue, setSelectedValue] = useState<any>(null);

//     const [nodeType, setNodeType] = useState<any>([{ value: 1, label: "Authority" }]);
//     const [nodeTypetemp, setNodeTypetemp] = useState<any>([{ value: 1, label: "Authority" }]);
//     const nodeTypeOptions = [
//         { value: 1, label: "Authority" },
//         { value: 2, label: "Committee" },
//         { value: 3, label: "Group" },
//     ];

//     const [isCommitteeChecked, setIsCommitteeChecked] = useState(false);
//     const [isCommitteeGroupChecked, setIsCommitteeGroupChecked] = useState(false);
//     const [routeMembercycles, setRouteMembercycles] = useState<any>()

//     useEffect(() => {
//         setSelectedValue(location.state.totalLevel);
//         console.log(location.state.routeMembercycless);
//         setRouteMembercycles(location.state.routeMembercycless);
//         getFileData();
//         getDepartmentData();
//         getAuthorityData();
//         getCommitteeGroupData();
//         getSectionData();
//         getCommitteeData();
//         console.log("routemember", routeMembercycles);
//         //handleCardTabChange()
//     }, []);

//     const getFileData = async () => {
//         const collectData = {
//             "fId": -1,
//             "inst_id": -1,
//             "user_id": -1,
//             "divisionid": -1
//         }

//         await api.post(`FileType/GetFileType`, collectData)
//             .then((res: any) => {
//                 const arr: any = [];
//                 for (let index = 0; index < res.data.data.length; index++) {
//                     arr.push({
//                         label: res.data.data[index]["fName"],
//                         value: res.data.data[index]["fId"]
//                     })
//                 }
//                 setFileOption(arr);
//             })
//     }

//     const getSectionData = async () => {
//         const collectData = {
//             "id": -1,
//             "nodeID": -1,
//             "titleID": -1,
//             "user_Id": ""
//         }

//         await api.post(`NewNodeMaster/GetNewNodeMaster`, collectData)
//             .then((res: any) => {
//                 const arr: any = [];
//                 for (let index = 0; index < res.data.data.length; index++) {
//                     arr.push({
//                         label: res.data.data[index]["name"],
//                         value: res.data.data[index]["id"]
//                     })
//                 }
//                 setSectionOption(arr);
//             })
//     }

//     const getDepartmentData = async () => {
//         const collectData = {
//             "departmentId": -1
//         }

//         await api.post(`Department/GetDepartmentmaster`, collectData)
//             .then((res: any) => {
//                 const arr: any = [];
//                 for (let index = 0; index < res.data.data.length; index++) {
//                     arr.push({
//                         label: res.data.data[index]["departmentName"],
//                         value: res.data.data[index]["departmentId"]
//                     })
//                 }
//                 setDepartmentOption(arr);
//             })
//     }

//     const getAuthorityData = async () => {
//         const collectData = {
//             "id": -1,
//             "officeId": -1,
//             "under_id": -1,
//             "divisionid": -1
//         }

//         await api.post(`AuthorityMaster/GetAuthorityMaster`, collectData)
//             .then((res: any) => {
//                 const arr: any = [];
//                 for (let index = 0; index < res.data.data.length; index++) {
//                     arr.push({
//                         label: res.data.data[index]["authorityType"],
//                         value: res.data.data[index]["id"]
//                     })
//                 }
//                 setAuthorityOpotion(arr);
//             })
//     }

//     const getCommitteeData = async () => {
//         const collectData = {
//             "id": -1,
//             "committeeName": "",
//             "officeId": 0,
//             "userId": "",
//             "ipAddress": "",
//             "type": "C"
//         }

//         await api.post(`CommitteeMaster/GetCommitteeMaster`, collectData)
//             .then((res: any) => {
//                 const arr: any = [];
//                 for (let index = 0; index < res.data.data.length; index++) {
//                     arr.push({
//                         label: res.data.data[index]["committeeName"],
//                         value: res.data.data[index]["id"]
//                     })
//                 }
//                 setCommitteeOption(arr);
//             })
//     }

//     const getCommitteeGroupData = async () => {
//         const collectData = {
//             "id": -1,
//             "committeeName": "",
//             "officeId": -1,
//             "userId": "",
//             "ipAddress": "",
//             "type": "G"
//         }

//         await api.post(`CommitteeMaster/GetCommitteeMaster`, collectData)
//             .then((res: any) => {
//                 const arr: any = [];
//                 for (let index = 0; index < res.data.data.length; index++) {
//                     arr.push({
//                         label: res.data.data[index]["committeeName"],
//                         value: res.data.data[index]["id"]
//                     })
//                 }
//                 setCommitteeGroupOption(arr);
//             })
//     }

//     const handleCheckboxChange = (event: any) => {
//         // getCommitteeData();
//         setIsCommitteeChecked(event.target.checked);
//     };

//     const handleCheckboxesChange = (event: any) => {
//         // getCommitteeData();
//         setIsCommitteeGroupChecked(event.target.checked);
//     };

//     // const handleNodeTypeChange = (newValue: any, cardIndex: number) => {
//     //     const updatedNodeTypes = [...nodeType];
//     //     updatedNodeTypes[cardIndex] = newValue?.value;
//     //     setNodeTypetemp(newValue);
//     //     setNodeType(updatedNodeTypes);
//     //     var tabindex = newValue?.value;
//     //     handleCardTabChange(newValue, cardIndex, tabindex);
//     // };

//     // const handleCardTabChange = (newValue: any, cardIndex: number, tabindex: number) => {
//     //     console.log("New Value:", newValue);
//     //     console.log("Card Index:", cardIndex);
//     //     console.log("TabIndex:", tabindex);
//     //     const updatedRouteMembercycless = [...routeMembercycles];
//     //     updatedRouteMembercycless[cardIndex] = {
//     //         ...updatedRouteMembercycless[cardIndex],
//     //         nodeMode: newValue?.label == "undefined" ? "Authority" : newValue?.label,
//     //         nodeType: newValue?.value == "undefined" ? 1 : newValue?.value,
//     //         arrivalDate: defaultValuestime,
//     //         uploadDate: defaultValuestime,
//     //         tabindex: tabindex,
//     //     };
//     //     setRouteMembercycles(updatedRouteMembercycless);
//     // };

//     const handleNodeTypeChange = (newValue: any, cardIndex: number) => {
//         const updatedNodeTypes = [...nodeType];
//         updatedNodeTypes[cardIndex] = newValue?.value;
//         setNodeTypetemp(newValue);
//         setNodeType(updatedNodeTypes);
//         var tabindex = newValue?.value;
//         handleCardTabChange(newValue, cardIndex, tabindex);
//     };

//     const handleCardTabChange = (newValue: any, cardIndex: number, tabindex: number) => {
//         console.log("New Value:", newValue);
//         console.log("Card Index:", cardIndex);
//         console.log("TabIndex:", tabindex);
//         const updatedRouteMembercycless = [...routeMembercycles];
//         updatedRouteMembercycless[cardIndex] = {
//             ...updatedRouteMembercycless[cardIndex],
//             nodeMode: newValue?.label == undefined ? "Authority" : newValue?.value?.toString(),
//             nodeModed: newValue?.label == undefined ? "Authority" : newValue?.label,
//             nodeType: newValue?.value == undefined ? 1 : newValue?.value,
//             arrivalDate: defaultValuestime,
//             uploadDate: defaultValuestime,
//             tabindex: tabindex,
//         };
//         setRouteMembercycles(updatedRouteMembercycless);
//     };

//     const [isSubRouteEnabled, setIsSubRouteEnabled] = useState(false);

//     const handleCheckboxedChange = (event: any) => {
//         setIsSubRouteEnabled(event.target.checked);
//     };

//     const formik = useFormik({
//         initialValues: {
//             "id": location.state.id,
//             "routeName": location.state.routeName,
//             "totalLevel": location.state.totalLevel,
//             "officeId": location.state.officeId,
//             "uplodDate": defaultValuestime,
//             "routeMembercycless": location.state.routeMembercycless
//         },
//         onSubmit: async (values) => {
//             values.routeMembercycless = routeMembercycles;
//             console.log("check", values);

//             const response = await api.post(
//                 `RouteMemberCycle/AddUpdateRouteMemberCycle`,
//                 values
//             );
//             if (response.data.isSuccess) {
//                 //setToaster(false);
//                 // toast.success(response.data.mesg);
//                 // formik.resetForm();
//                 //getList();
//                 //setEditId("-1");
//             } else {
//                 //setToaster(true);
//                 //toast.error(response.data.mesg);
//             }
//         },
//     });

//     const handleAutocompleteChange = (event: React.SyntheticEvent, value: any) => {
//         formik.setFieldValue("totalLevel", value);

//         var arr = Array.from({ length: value }, () => (
//             {
//                 id: -1,
//                 nodeMode: "Authority",
//                 nodeModed: "Authority",
//                 nodeType: 1,
//                 authorityId: 0,
//                 email: "",
//                 sms: "",
//                 arrivalDate: defaultValuestime,
//                 message: "",
//                 authorityLevel: 0,
//                 routeId: 0,
//                 officeId: 1,
//                 uploadDate: defaultValuestime,
//                 subRoute: 0,
//                 committee: 0,
//                 memGroup: 0,
//                 committeeOrGroupId: 0,
//                 auth_DeptId: 0,
//                 auth_SectionId: 0,
//                 tabindex: 1
//             })
//         )

//         setRouteMembercycles(arr);
//         // console.log("routeMembercycles onchange",routeMembercycles)
//         setSelectedValue(value);
//     };

//     const renderCards = () => {
//         if (selectedValue === null) {
//             return null;
//         }

//         const numberOfCards = parseInt(selectedValue);

//         const cards = Array.from({ length: numberOfCards }, (_, index) => (
//             <Grid item xs={4} key={index}>
//                 <Card style={{ marginTop: "10px", backgroundColor: "#89CFF0" }}>
//                     <CardContent  >
//                         <CardContent sx={{ padding: 0 }}>
//                             <Grid container style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                                 <h2>Level {index + 1}</h2>
//                                 <Grid xs={5} item>
//                                     <Autocomplete
//                                         disablePortal
//                                         disableClearable
//                                         id={`node-type-combo-box-${index}`}
//                                         fullWidth
//                                         size="small"
//                                         style={{ background: "white" }}
//                                         value={nodeTypeOptions.find((opt:any) => opt.value === parseInt(routeMembercycles[index]?.nodeMode))}
//                                         options={nodeTypeOptions}
//                                         onChange={(event, newValue) => handleNodeTypeChange(newValue, index)}
//                                         renderInput={(params) => (
//                                             <TextField {...params} label="Select Node Type" />
//                                         )}
//                                     />
//                                 </Grid>
//                             </Grid>
//                         </CardContent>

//                         <Divider />
//                         <br />

//                         <Box sx={{ bgcolor: 'background.paper' }}>
//                             <Tabs
//                                 value={routeMembercycles[index].tabindex}
//                                 variant="scrollable"
//                                 scrollButtons={false}
//                                 aria-label="scrollable prevent tabs example"
//                             >
//                                 {routeMembercycles[index].nodeType === 1 && (
//                                     <Tab
//                                         label="Authority"
//                                         onClick={() => {
//                                             console.log("routeMembercycles", routeMembercycles);
//                                             handleCardTabChange({ value: 1, label: 'Authority' }, index, 1);
//                                         }}
//                                         value={1}
//                                         sx={{
//                                             backgroundColor: routeMembercycles[index].tabindex === 1 ? '#F0F8FF' : 'inherit',
//                                             color: routeMembercycles[index].tabindex === 1 ? 'white' : 'inherit'
//                                         }}
//                                     />
//                                 )}
//                                 {routeMembercycles[index].nodeType === 2 && (
//                                     <Tab
//                                         label="Committe"
//                                         onClick={() => {
//                                             handleCardTabChange({ value: 2, label: 'Committe' }, index, 2);
//                                         }}
//                                         value={2}
//                                         sx={{
//                                             backgroundColor: routeMembercycles[index].tabindex === 2 ? '#F0F8FF' : 'inherit',
//                                             color: routeMembercycles[index].tabindex === 2 ? 'white' : 'inherit'
//                                         }}
//                                     />
//                                 )}
//                                 {routeMembercycles[index].nodeType === 3 && (
//                                     <Tab
//                                         label="Group"
//                                         onClick={() => {
//                                             handleCardTabChange({ value: 3, label: 'Group' }, index, 3);
//                                         }}
//                                         value={3}
//                                         sx={{
//                                             backgroundColor: routeMembercycles[index].tabindex === 3 ? '#F0F8FF' : 'inherit',
//                                             color: routeMembercycles[index].tabindex === 3 ? 'white' : 'inherit'
//                                         }}
//                                     />
//                                 )}
//                                 <Tab
//                                     label="Committe/Group Parameters"
//                                     onClick={() => {
//                                         handleCardTabChange({ value: 0, label: 'Committee/Group Parameters' }, index, 0);
//                                         console.log(routeMembercycles[index].tabindex);
//                                     }}
//                                     value={0}
//                                     sx={{
//                                         backgroundColor: routeMembercycles[index].tabindex === 0 ? '#F0F8FF' : 'inherit',
//                                         color: routeMembercycles[index].tabindex === 0 ? 'white' : 'inherit'
//                                     }}
//                                 />
//                             </Tabs>
//                         </Box>

//                         <br />
//                         {routeMembercycles.length > 0 && (
//                             <>
//                                 {routeMembercycles[index].tabindex == 0 ? (<>
//                                     <Grid item xs={12} container spacing={2}>
//                                         <Grid item xs={12} container spacing={2}>
//                                             <Grid item xs={12}>
//                                                 <Typography>Authority is required to transfer file over : </Typography>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <Typography>Mode</Typography>
//                                             </Grid>
//                                             <Grid item xs={4}>

//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <Typography>Priority</Typography>
//                                             </Grid>
//                                         </Grid>
//                                         <Divider />

//                                         <Grid container item xs={12} gap={2}>
//                                             <Grid item xs={3}>
//                                                 <FormControl component="fieldset">

//                                                     <FormGroup aria-label="position" row>
//                                                         <FormControlLabel
//                                                             value="SubRoute"
//                                                             control={<Checkbox checked={isSubRouteEnabled} onChange={handleCheckboxedChange} />}
//                                                             label="Sub Route"
//                                                             labelPlacement="end"
//                                                         />
//                                                     </FormGroup>
//                                                 </FormControl>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 <TextField
//                                                     id="subRoute"
//                                                     name="subRoute"
//                                                     size="small"
//                                                     fullWidth
//                                                     label="Enter SubRoute Name"
//                                                     placeholder="Enter SubRoute Name"
//                                                     style={{ background: "white" }}
//                                                     type="number"
//                                                     disabled={!isSubRouteEnabled}
//                                                     onChange={(event) =>
//                                                         routeMembercycles[index].subRoute = event.target.value
//                                                     }
//                                                 />
//                                             </Grid>
//                                             <Grid xs={3} item>

//                                                 <Autocomplete
//                                                     disablePortal
//                                                     id="combo-box-demo"
//                                                     fullWidth
//                                                     style={{ background: "white" }}
//                                                     size="small"
//                                                     options={[0, 1, 2,]}
//                                                     renderInput={(params) => (
//                                                         <TextField {...params} label="Select Priority" />
//                                                     )}
//                                                 />

//                                             </Grid>
//                                         </Grid>

//                                         <Grid container item xs={12} gap={2}>
//                                             <Grid item xs={3}>
//                                                 <FormControl component="fieldset">

//                                                     <FormGroup aria-label="position" row>
//                                                         <FormControlLabel
//                                                             value="Committee"
//                                                             control={<Checkbox onChange={handleCheckboxChange} />}
//                                                             label="Committee"
//                                                             labelPlacement="end"
//                                                         // onChange={(event) => formik.setFieldValue("committee", event.target.checked)}
//                                                         />
//                                                     </FormGroup>
//                                                 </FormControl>
//                                             </Grid>
//                                             <Grid item xs={4}>
//                                                 {isCommitteeChecked ? (
//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={committeeOption}
//                                                         fullWidth
//                                                         style={{ background: "white" }}
//                                                         size="small"
//                                                         onChange={(e: any, newValue: any) => {
//                                                             console.log(newValue);
//                                                             //formik.setFieldValue("committee", newValue?.value)
//                                                             routeMembercycles[index].committee = newValue?.value
//                                                         }}
//                                                         renderInput={(params) => (
//                                                             <TextField {...params} label="Select Committee Name" />
//                                                         )}
//                                                     />) : (<TextField
//                                                         fullWidth
//                                                         size="small"
//                                                         label=""
//                                                         style={{ background: "white" }}

//                                                         InputProps={{
//                                                             readOnly: true,
//                                                         }}
//                                                     />)}
//                                             </Grid>
//                                             <Grid xs={3} item>
//                                                 <Autocomplete
//                                                     disablePortal
//                                                     id="combo-box-demo"
//                                                     fullWidth
//                                                     style={{ background: "white" }}
//                                                     size="small"
//                                                     options={[0, 1, 2,]}
//                                                     renderInput={(params) => (
//                                                         <TextField {...params} label="Select Priority" />
//                                                     )}
//                                                 />
//                                             </Grid>
//                                         </Grid>

//                                         <Grid container item xs={12} gap={2}>
//                                             <Grid item xs={3}>
//                                                 <FormControl component="fieldset">

//                                                     <FormGroup aria-label="position" row>
//                                                         <FormControlLabel
//                                                             value="Group"
//                                                             control={<Checkbox onChange={handleCheckboxesChange} />}
//                                                             label="Group"
//                                                             labelPlacement="end"
//                                                         />
//                                                     </FormGroup>
//                                                 </FormControl>
//                                             </Grid>
//                                             <Grid item xs={4}>

//                                                 {isCommitteeGroupChecked ? (
//                                                     <Autocomplete
//                                                         disablePortal
//                                                         id="combo-box-demo"
//                                                         options={committeeGroupOption}
//                                                         fullWidth
//                                                         style={{ background: "white" }}
//                                                         size="small"
//                                                         onChange={(e: any, newValue: any) => {
//                                                             console.log(newValue);
//                                                             //formik.setFieldValue("memGroup", newValue?.value)
//                                                             routeMembercycles[index].memGroup = newValue?.value
//                                                         }}
//                                                         renderInput={(params) => (
//                                                             <TextField {...params} label="Select Group Name" />
//                                                         )}
//                                                     />) : (<TextField
//                                                         fullWidth
//                                                         size="small"
//                                                         label=""
//                                                         style={{ background: "white" }}

//                                                         InputProps={{
//                                                             readOnly: true,
//                                                         }}
//                                                     />)}
//                                             </Grid>
//                                             <Grid xs={3} item>

//                                                 <Autocomplete
//                                                     disablePortal
//                                                     id="combo-box-demo"
//                                                     style={{ background: "white" }}
//                                                     fullWidth
//                                                     size="small"
//                                                     options={[0, 1, 2,]}
//                                                     renderInput={(params) => (
//                                                         <TextField {...params} label="Select Priority" />
//                                                     )}
//                                                 />

//                                             </Grid>
//                                         </Grid>
//                                     </Grid>
//                                 </>) : (
//                                     <>
//                                         {routeMembercycles[index].tabindex === 1 && (
//                                             <div style={{ backgroundColor: "background.paper" }}>
//                                                 <Grid item xs={12} container spacing={2} marginBottom={5} alignItems="center" justifyContent="center">
//                                                     <Grid xs={6} item>

//                                                         <Autocomplete
//                                                             disablePortal
//                                                             id="combo-box-demo"
//                                                             options={departmentOption}
//                                                             fullWidth
//                                                             size="small"
//                                                             value={departmentOption.find((opt:any)=>opt.value === routeMembercycles[index]?.auth_DeptId)}
//                                                             style={{ background: "white" }}
//                                                             onChange={(e: any, newValue: any) => {
//                                                                 console.log(newValue);
//                                                                 routeMembercycles[index].auth_DeptId = newValue?.value;
//                                                                 handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                             }}
//                                                             renderInput={(params) => (
//                                                                 <TextField {...params} label="Select Department" />
//                                                             )}
//                                                         />

//                                                     </Grid>

//                                                     <Grid xs={6} item>

//                                                         <Autocomplete
//                                                             disablePortal
//                                                             id="combo-box-demo"
//                                                             fullWidth
//                                                             size="small"
//                                                             options={sectionOption}
//                                                             value={sectionOption.find((opt:any)=>opt.value === routeMembercycles[index]?.auth_SectionId)}
//                                                             style={{ background: "white" }}
//                                                             onChange={(e: any, newValue: any) => {
//                                                                 console.log("section value", newValue)
//                                                                 routeMembercycles[index].auth_SectionId = newValue?.value;
//                                                                 handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                             }}
//                                                             renderInput={(params) => (
//                                                                 <TextField {...params} label="Select Section" />
//                                                             )}
//                                                         />

//                                                     </Grid>

//                                                     <Grid xs={6} item>

//                                                         <Autocomplete
//                                                             disablePortal
//                                                             id="combo-box-demo"
//                                                             fullWidth
//                                                             size="small"
//                                                             options={authorityOption}
//                                                             value={authorityOption.find((opt:any)=>opt.value === routeMembercycles[index]?.authorityId)}
//                                                             onChange={(e: any, newValue: any) => {
//                                                                 console.log("authorityId value", newValue)
//                                                                 routeMembercycles[index].authorityId = newValue?.value;
//                                                                 handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                             }}
//                                                             style={{ background: "white" }}
//                                                             renderInput={(params) => (
//                                                                 <TextField {...params} label="Select Authority" />
//                                                             )}
//                                                         />

//                                                     </Grid>

//                                                     <Grid xs={6} item>
//                                                         NA
//                                                     </Grid>

//                                                     <Grid xs={6} item alignItems="center" justifyContent="center">
//                                                         <img src={auth} alt="Authority" height="100px" />
//                                                     </Grid>

//                                                     <Grid xs={6} item>
//                                                         NA
//                                                     </Grid>

//                                                     <Grid item xs={12} container spacing={2}>

//                                                         <Grid xs={4} item>
//                                                             <FormControl component="fieldset">

//                                                                 <FormGroup aria-label="position" row >
//                                                                     <FormLabel component="legend" defaultValue="e">Notify by :</FormLabel>
//                                                                     <FormControlLabel
//                                                                         value="e"
//                                                                         control={<Checkbox onChange={(event) => {
//                                                                             if (event.target.checked) {
//                                                                                 routeMembercycles[index].email = event.target.value;
//                                                                             } else {
//                                                                                 routeMembercycles[index].email = "";
//                                                                             }
//                                                                             handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                         }} />}
//                                                                         label="E-Mail"
//                                                                         checked={routeMembercycles[index]?.email === "e"}
//                                                                         labelPlacement="end"
//                                                                     />

//                                                                     <FormControlLabel
//                                                                         value="s"
//                                                                         control={<Checkbox onChange={(event) => {
//                                                                             if (event.target.checked) {
//                                                                                 routeMembercycles[index].sms = event.target.value;
//                                                                             } else {
//                                                                                 routeMembercycles[index].sms = "";
//                                                                             }
//                                                                             handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                         }} />}
//                                                                         label="SMS"
//                                                                         checked={routeMembercycles[index]?.sms === "s"}
//                                                                         labelPlacement="end"
//                                                                     />
//                                                                 </FormGroup>
//                                                             </FormControl>
//                                                         </Grid>

//                                                         <Grid xs={4} item>
//                                                             <TextareaAutosize
//                                                                 aria-label="empty textarea"
//                                                                 placeholder="Enter Message"
//                                                                 style={{
//                                                                     width: "200px",
//                                                                     fontSize: " 1.075rem",
//                                                                     fontWeight: "400",
//                                                                     lineHeight: "6",
//                                                                     padding: "8px 12px",
//                                                                     borderRadius: "4px",
//                                                                 }}
//                                                                 value={routeMembercycles[index].message}
//                                                                 onChange={(event) => {
//                                                                     routeMembercycles[index].message = event.target.value;
//                                                                     formik.setFieldValue("message", event.target.value);
//                                                                     handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                 }}
//                                                                 onBlur={formik.handleBlur}
//                                                             />
//                                                         </Grid>

//                                                     </Grid >
//                                                 </Grid>
//                                             </div>
//                                         )}
//                                         {routeMembercycles[index].tabindex === 2 && (
//                                             <>
//                                                 <Grid item xs={12} container spacing={2} marginBottom={5}>
//                                                     <Grid xs={6} item container alignItems="center" justifyContent="center">
//                                                         <img src={comm} alt="Committee" height="100px" />
//                                                     </Grid>
//                                                     <Grid item xs={6} container spacing={2}>
//                                                         <Grid item lg={12} xs={12} >
//                                                             <Autocomplete
//                                                                 disablePortal
//                                                                 id="combo-box-demo"
//                                                                 options={committeeOption}
//                                                                 style={{ background: "white" }}
//                                                                 value={committeeOption.find((opt:any)=>opt.value === routeMembercycles[index]?.committeeOrGroupId)}
//                                                                 fullWidth
//                                                                 size="small"
//                                                                 onChange={(event: any, newValue: any) => {
//                                                                     console.log(newValue?.value, event.target.value);
//                                                                     routeMembercycles[index].committeeOrGroupId = newValue?.value;
//                                                                     handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                 }}
//                                                                 renderInput={(params) => (
//                                                                     <TextField {...params} label={
//                                                                         <span>
//                                                                             {"Committee"}
//                                                                         </span>
//                                                                     } />
//                                                                 )}
//                                                             />

//                                                         </Grid>

//                                                         <Grid item lg={12} xs={12}>
//                                                             <TextField
//                                                                 id="zoneCode"
//                                                                 name="zoneCode"
//                                                                 label="Enter Description"
//                                                                 placeholder="Enter Description"
//                                                                 size="small"
//                                                                 style={{ background: "white" }}
//                                                                 fullWidth
//                                                             />
//                                                         </Grid>
//                                                     </Grid>

//                                                     <Grid item xs={12} container spacing={2}>

//                                                         <Grid xs={4} item>
//                                                             <FormControl component="fieldset">

//                                                                 <FormGroup aria-label="position" row >
//                                                                     <FormLabel component="legend" defaultValue="e">Notify by :</FormLabel>
//                                                                     <FormControlLabel
//                                                                         value="e"
//                                                                         control={<Checkbox onChange={(event) => {
//                                                                             if (event.target.checked) {
//                                                                                 routeMembercycles[index].email = event.target.value;
//                                                                             } else {
//                                                                                 routeMembercycles[index].email = "";
//                                                                             }
//                                                                             handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                         }} />}
//                                                                         label="E-Mail"
//                                                                         checked={routeMembercycles[index]?.email === "e"}
//                                                                         labelPlacement="end"
//                                                                     />

//                                                                     <FormControlLabel
//                                                                         value="s"
//                                                                         control={<Checkbox onChange={(event) => {
//                                                                             if (event.target.checked) {
//                                                                                 routeMembercycles[index].sms = event.target.value;
//                                                                             } else {
//                                                                                 routeMembercycles[index].sms = "";
//                                                                             }
//                                                                             handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                         }} />}
//                                                                         label="SMS"
//                                                                         checked={routeMembercycles[index]?.sms === "s"}
//                                                                         labelPlacement="end"
//                                                                     />
//                                                                 </FormGroup>
//                                                             </FormControl>
//                                                         </Grid>

//                                                         <Grid xs={4} item>
//                                                             <TextareaAutosize
//                                                                 aria-label="empty textarea"
//                                                                 placeholder="Enter Message"
//                                                                 style={{
//                                                                     width: "200px",
//                                                                     fontSize: " 1.075rem",
//                                                                     fontWeight: "400",
//                                                                     lineHeight: "6",
//                                                                     padding: "8px 12px",
//                                                                     borderRadius: "4px",
//                                                                 }}
//                                                                 value={routeMembercycles[index].message}
//                                                                 onChange={(event) => {
//                                                                     routeMembercycles[index].message = event.target.value;
//                                                                     formik.setFieldValue("message", event.target.value);
//                                                                     handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                 }}
//                                                                 onBlur={formik.handleBlur}
//                                                             />
//                                                         </Grid>
//                                                     </Grid >
//                                                 </Grid>

//                                             </>
//                                         )}
//                                         {routeMembercycles[index].tabindex === 3 && (
//                                             <>
//                                                 <Grid item xs={12} container spacing={2} marginBottom={5}>

//                                                     <Grid xs={6} item container alignItems="center" justifyContent="center">
//                                                         <img src={grp} alt="Group" height="50px" />
//                                                     </Grid>

//                                                     <Grid item xs={6} container spacing={2}>
//                                                         <Grid item lg={12} xs={12}>
//                                                             <Autocomplete
//                                                                 disablePortal
//                                                                 id="combo-box-demo"
//                                                                 options={committeeGroupOption}
//                                                                 fullWidth
//                                                                 size="small"
//                                                                 value={committeeGroupOption.find((opt:any)=>opt.value === routeMembercycles[index]?.memGroup)}
//                                                                 onChange={(event: any, newValue: any) => {
//                                                                     console.log(newValue?.value);
//                                                                     routeMembercycles[index].memGroup = newValue?.value;
//                                                                     handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                 }}
//                                                                 style={{ background: "white" }}
//                                                                 renderInput={(params) => (
//                                                                     <TextField {...params} label={
//                                                                         <span>
//                                                                             {"Select Group"}
//                                                                         </span>
//                                                                     } />
//                                                                 )}
//                                                             />
//                                                         </Grid>

//                                                         <Grid item lg={12} xs={12}>
//                                                             <TextField
//                                                                 id="zoneCode"
//                                                                 name="zoneCode"
//                                                                 label="Enter Description"
//                                                                 style={{ background: "white" }}
//                                                                 placeholder="Enter Description"
//                                                                 size="small"
//                                                                 fullWidth
//                                                             />
//                                                         </Grid>
//                                                     </Grid>

//                                                     <Grid item xs={12} container spacing={2}>

//                                                         <Grid xs={4} item>
//                                                             <FormControl component="fieldset">

//                                                                 <FormGroup aria-label="position" row >
//                                                                     <FormLabel component="legend" defaultValue="e">Notify by :</FormLabel>
//                                                                     <FormControlLabel
//                                                                         value="e"
//                                                                         control={<Checkbox onChange={(event) => {
//                                                                             if (event.target.checked) {
//                                                                                 routeMembercycles[index].email = event.target.value;
//                                                                             } else {
//                                                                                 routeMembercycles[index].email = "";
//                                                                             }
//                                                                             handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                         }} />}
//                                                                         label="E-Mail"
//                                                                         checked={routeMembercycles[index]?.email === "e"}
//                                                                         labelPlacement="end"
//                                                                     />

//                                                                     <FormControlLabel
//                                                                         value="s"
//                                                                         control={<Checkbox onChange={(event) => {
//                                                                             if (event.target.checked) {
//                                                                                 routeMembercycles[index].sms = event.target.value;
//                                                                             } else {
//                                                                                 routeMembercycles[index].sms = "";
//                                                                             }
//                                                                             handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                         }} />}
//                                                                         label="SMS"
//                                                                         checked={routeMembercycles[index]?.sms === "s"}
//                                                                         labelPlacement="end"
//                                                                     />
//                                                                 </FormGroup>
//                                                             </FormControl>
//                                                         </Grid>

//                                                         <Grid xs={4} item>
//                                                             <TextareaAutosize
//                                                                 aria-label="empty textarea"
//                                                                 placeholder="Enter Message"
//                                                                 style={{
//                                                                     width: "200px",
//                                                                     fontSize: " 1.075rem",
//                                                                     fontWeight: "400",
//                                                                     lineHeight: "6",
//                                                                     padding: "8px 12px",
//                                                                     borderRadius: "4px",
//                                                                 }}
//                                                                 value={routeMembercycles[index].message}
//                                                                 onChange={(event) => {
//                                                                     routeMembercycles[index].message = event.target.value;
//                                                                     formik.setFieldValue("message", event.target.value);
//                                                                     handleCardTabChange(nodeTypetemp, index, routeMembercycles[index].tabindex);
//                                                                 }}
//                                                                 onBlur={formik.handleBlur}
//                                                             />
//                                                         </Grid>
//                                                     </Grid >

//                                                 </Grid>
//                                             </>
//                                         )}

//                                     </>)}
//                             </>)}
//                     </CardContent>
//                 </Card>
//             </Grid>
//         ));

//         return (
//             <Grid container spacing={2}>
//                 {cards}
//             </Grid>
//         );
//     };

//     return (
//         <div>
//             <div
//                 style={{
//                     padding: "-5px 5px",
//                     backgroundColor: "#ffffff",
//                     borderRadius: "5px",
//                     //   border: ".5px solid #FF7722",
//                     marginTop: "3vh"
//                 }}
//             >

//                 <CardContent>
//                     <Typography
//                         variant="h5"
//                         textAlign="center"
//                         style={{ fontSize: "18px", fontWeight: 500 }}
//                     >
//                         Edit Route
//                     </Typography>

//                     <Grid item sm={4} xs={12}>
//                         <Typography style={{ marginTop: "-75px" }}>
//                             <Button
//                                 type="submit"
//                                 onClick={() => back(-1)}
//                                 variant="contained"
//                                 style={{
//                                     marginBottom: 15,
//                                     marginTop: "45px",
//                                     backgroundColor: "blue",
//                                     width: 20,
//                                 }}
//                             >
//                                 <ArrowBackSharpIcon />
//                             </Button>
//                         </Typography>
//                     </Grid>
//                     <Divider />
//                     <br />

//                     <form onSubmit={formik.handleSubmit}>
//                         <Grid item xs={12} container spacing={3}>

//                             <Grid xs={5} item>

//                                 <TextField
//                                     id="routeName"
//                                     name="routeName"
//                                     label="Enter Route Name"
//                                     value={formik.values.routeName}
//                                     placeholder="Enter Route Name"
//                                     size="small"
//                                     style={{ background: "white" }}
//                                     fullWidth
//                                     onChange={formik.handleChange}
//                                 //   onBlur={formik.handleBlur}
//                                 />
//                             </Grid>

//                             <Grid xs={5} item>

//                                 <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     // options={ZoneOption}
//                                     fullWidth
//                                     size="small"
//                                     options={[1, 2, 3, 4, 5, 6, 7]}
//                                     value={formik.values.totalLevel}
//                                     onChange={handleAutocompleteChange}
//                                     renderInput={(params) => (
//                                         <TextField {...params} label="Select level" />
//                                     )}
//                                 />

//                             </Grid>
//                             <Grid item xs={12} container>
//                                 {renderCards()}
//                             </Grid>
//                             <Grid item xs={2}>
//                                 {/*  {permissionData?.isAdd == true ? ( */}
//                                 <Button type="submit" fullWidth variant="contained" size="large">
//                                     {t("text.save")}
//                                 </Button>
//                                 {/* ) : ( */}
//                                 {/*   "" */}
//                                 {/* )} */}
//                             </Grid>
//                         </Grid>
//                     </form>
//                 </CardContent>
//                 <ToastApp />
//             </div>
//         </div>
//     );
// };
