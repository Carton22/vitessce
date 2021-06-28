/* eslint-disable */
import React, { useReducer, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import HelpIcon from '@material-ui/icons/Help';

import LoadingIndicator from './LoadingIndicator';
import { PopperMenu } from './shared-mui/components';

import { useStyles } from './title-info-styles';

function SettingsIconWithArrow({ open }) {
  return (
    <>
      <SettingsIcon />
      {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
    </>
  );
}

function PlotOptions(props) {
  const { options } = props;
  const [open, toggle] = useReducer(v => !v, false);
  const classes = useStyles();
  return (
    <PopperMenu
      open={open}
      toggle={toggle}
      buttonIcon={<SettingsIconWithArrow open={open} />}
      buttonClassName={classes.iconButton}
      placement="bottom-end"
    >
      {options}
    </PopperMenu>
  );
}

function CloudDownloadIconWithArrow({ open }) {
  return (
    <>
      <CloudDownloadIcon />
      {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
    </>
  );
}

function DownloadOptions(props) {
  const { urls } = props;
  
  const classes = useStyles();
  return (
    <>
      {urls.map(({ url, name }) => (
        <MenuItem dense key={url}>
          <Link underline="none" href={url} target="_blank" rel="noopener" className={classes.downloadLink}>
            Download {name}
          </Link>
        </MenuItem>
      ))}
    </>
  );
}

function ClosePaneButton(props) {
  const { removeGridComponent } = props;
  const classes = useStyles();
  return (
    <IconButton
      onClick={removeGridComponent}
      size="small"
      className={classes.iconButton}
      title="close"
    >
      <CloseIcon />
    </IconButton>
  );
}

export default function TitleInfo(props) {
  const {
    title, info, children, isScroll, isSpatial, removeGridComponent, urls,
    isReady, options, help,
  } = props;
  
  const [tab, setTab] = useState("main");
  
  const TABS = ["main", "options", "help", ...(urls ? ["downloads"] : [])];
  const tabIndex = TABS.indexOf(tab);
  const isMainTab = tab === "main";
  
  const classes = useStyles({ isScroll, isSpatial, isMainTab });
  
  const downloads = (
      <DownloadOptions urls={urls} />
  );
  
  const tabContent = [children, options, help, ...(urls ? [downloads] : [])];
  
  const handleTabChange = (event, newTabIndex) => {
    //console.log({ ...event });
    if(newTabIndex === TABS.length) {
      removeGridComponent();
    } else {
      setTab(TABS[newTabIndex]);
    }
  };
  
  return (
    <>
      <Box className={`title ${classes.titleBox}`}>
        <h2 className={classes.titleText}>{title}</h2>
        <Tabs
          classes={{ root: classes.tabsRoot, scroller: classes.tabsScroller, indicator: classes.tabsIndicator }}
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="tabs"
        >
          <Tab icon={<BubbleChartIcon />} aria-label="main" className={`${classes.tab} ${classes.iconTab}`} />
          <Tab icon={<SettingsIcon />} aria-label="values" className={`${classes.tab} ${classes.iconTab}`} />
          <Tab icon={<HelpIcon />} aria-label="help" className={`${classes.tab} ${classes.iconTab}`} />
          {urls ? (
            <Tab icon={<CloudDownloadIcon />} aria-label="downloads" className={`${classes.tab} ${classes.iconTab}`} />
          ) : null}
          <Tab icon={<CloseIcon />} aria-label="close" className={`${classes.tab} ${classes.iconTab}`} />
        </Tabs>
      </Box>
      <Card className={classes.card}>
        { !isReady && <LoadingIndicator /> }
        <div className={classes.mainTabContainer}>
          {children}
        </div>
        {!isMainTab ? (
          <div className={classes.auxTabContainer}>
            {tabContent[tabIndex]}
          </div>
        ) : null}
        {isMainTab && info && info.length ? (
          <span className={classes.info}>{info}</span>
        ) : null}
      </Card>
    </>
  );
}
