import {
  DEVICE_ACTIVATED,
  DEVICE_EXPIRED,
  DEVICE_PENDING_ACTIVATION,
  DEVICE_PRE_ACTIVATION,
  DEVICE_SUSPENDED,
  DEVICE_UNLINKED,
  DEVICE_TRIAL
} from '../../constants/Constants'

import {
  DEALER_ID,
  DEALER_NAME,
  DEALER_EMAIL,
  DEALER_PIN,
  DEALER_DEVICES,
  DEALER_TOKENS,
  DEALER_ACTION
} from '../../constants/DealerConstants';




import React, { Component } from 'react';
import { Input } from 'antd';
import { DEVICE_DEALER_ID, DEVICE_DEALER_PIN, DEVICE_DEALER_NAME } from '../../constants/DeviceConstants';

import { cloneableGenerator } from 'redux-saga/utils';


export function getStatus(status, account_status, unlink_status, device_status, activation_status) {

  if (status === 'active' && (account_status === '' || account_status === null) && unlink_status === 0 && (device_status === 1 || device_status === '1')) {
    return DEVICE_ACTIVATED;
  } else if (status === 'expired') {
    return DEVICE_EXPIRED;
  } else if ((device_status === '0' || device_status === 0) && (unlink_status === '0' || unlink_status === 0) && (activation_status === null || activation_status === '')) {
    return DEVICE_PENDING_ACTIVATION;
  } else if ((device_status === '0' || device_status === 0) && (unlink_status === '0' || unlink_status === 0) && (activation_status === 0)) {
    return DEVICE_PRE_ACTIVATION;
  } else if ((unlink_status === '1' || unlink_status === 1) && (device_status === 0 || device_status === '0')) {
    // console.log("hello unlinked");
    return DEVICE_UNLINKED;
  } else if (account_status === 'suspended') {
    return DEVICE_SUSPENDED;
  } else {
    return 'N/A';
  }
}

export function getColor(status) {
  switch (status) {
    case DEVICE_ACTIVATED:
      return { color: "#008000" };

    case DEVICE_TRIAL:
      return { color: "#008000" };

    case DEVICE_PRE_ACTIVATION:
      return { color: "#0000FF" };

    case DEVICE_EXPIRED:
      return { color: "#FF0000" };
    case DEVICE_UNLINKED:
      return { color: "#FFA500" };
    case DEVICE_SUSPENDED:
      return { color: "#cccc0e" };
    case DEVICE_PENDING_ACTIVATION:
      return { color: "grey" };
    default:
      return {};
  }
}
export function getSortOrder(status) {
  switch (status) {
    case DEVICE_ACTIVATED:
      return '1';
    case DEVICE_PRE_ACTIVATION:
      return '4';
    case DEVICE_EXPIRED:
      return '2';
    case DEVICE_UNLINKED:
      return '7';
    case DEVICE_SUSPENDED:
      return '3';
    case DEVICE_PENDING_ACTIVATION:
      return '5';
    default:
      return
  }
}

export function checkValue(value) {
  if (value !== undefined && value !== '' && value !== null && value !== 'undefined' && value !== 'Undefined' && value !== "UNDEFINED" && value !== 'null' && value !== 'Null' && value !== 'NULL') {
    return value;
  } else {
    return 'N/A';
  }
}
export function getDealerStatus(unlink_status, account_status) {
  if (unlink_status === 1) {
    return "unlinked";
  } else if ((account_status === '' || account_status === null) && (unlink_status === 0)) {
    return 'active'
  } else if (account_status === 'suspended') {
    return 'suspended';
  } else {
    return 'N/A';
  }
}

export function componentSearch(arr, search) {
  let foundDevices = [];
  let obks = Object.keys(arr[0]);
  arr.map((el) => {
    obks.some((obk) => {
      if (obk) {
        let temp = el[obk];
        if (obk == 'dealer_id')
          temp = temp.toString()
        if ((typeof temp) === 'string') {
          if (temp.toLowerCase().includes(search.toLowerCase())) {
            foundDevices.push(el);
            return true;
          }
        }
      }
    });
  })
  return foundDevices;
}

export function getFormattedDate(value) {
  function convert(str) {
    var month, day, year, hours, minutes, seconds;
    var date = new Date(str),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    hours = ("0" + date.getHours()).slice(-2);
    minutes = ("0" + date.getMinutes()).slice(-2);
    seconds = ("0" + date.getSeconds()).slice(-2);

    var mySQLDate = [month, day, date.getFullYear()].join("-");
    var mySQLTime = [hours, minutes, seconds].join(":");
    return [mySQLDate, mySQLTime].join(" ");
  }

  let date = new Date(value);
  let formattedDate = convert(date)
  return formattedDate;
  // date.toLocaleDateString('%d-%b-%Y');
}

export function initCap(str) {
  return str.replace(/^\w/, function (chr) { return chr.toUpperCase() })
}
export function titleCase(str) {
  var wordsArray = str.toLowerCase().split(/\s+/);
  var upperCased = wordsArray.map(function (word) {
    var dashWords = word.split("-");
    if (dashWords.length > 1) {
      return dashWords.map((dWord, index) => {
        var char = (++index !== dashWords.length) ? "-" : "";
        return dWord.charAt(0).toUpperCase() + dWord.substr(1) + char;
      })
    } else {
      if (word === "id" || word === "pgp" || word === "ip") {
        return word.toUpperCase();
      } else {
        return word.charAt(0).toUpperCase() + word.substr(1);
      }
    }
  });
  return upperCased.join(" ").toString().replace(",", "");
}
export function checkRemainDays(createDate, validity) {
  var validDays = 0, createdDateTime, today, days;
  if (validity !== null) validDays = validity;
  createdDateTime = new Date(createDate);
  createdDateTime.setDate(createdDateTime.getDate() + validDays);
  today = new Date();
  var difference_ms = createdDateTime.getTime() - today.getTime();

  //Get 1 day in milliseconds
  var one_day = 1000 * 60 * 60 * 24;

  // Convert back to days and return
  days = Math.round(difference_ms / one_day);
  // console.log('checkk days And validity');
  // console.log(days);
  // console.log(validity, 'klkl')

  if (days > 0) return days; else if (days <= 0) return "Expired"; else return "Not Announced";
}

export function isBase64(str) {
  if (str === '' || str.trim() === '') { return false; }
  try {
    return atob(str)
  } catch (err) {
    return false;
  }
}


export function convertToLang(lngWord, constant) {
  if (lngWord !== undefined && lngWord !== '' && lngWord !== null) {
    return lngWord;
  } else if (constant !== undefined && constant !== '' && constant !== null) {
    return constant;
  } else { return "N/A"; }
}