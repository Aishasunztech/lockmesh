import moment_timezone from "moment-timezone";
import moment from 'moment';
import jsPDF from 'jspdf';
import XLSX from 'xlsx';
import jsPDFautotable from 'jspdf-autotable';

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

import { DEVICE_DEALER_ID, DEVICE_DEALER_PIN, DEVICE_DEALER_NAME } from '../../constants/DeviceConstants';

import { isArray } from "util";

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

export function getDateTimeOfClientTimeZone (dateTime){
  if(Intl.DateTimeFormat().resolvedOptions().timeZone){
    return moment_timezone(dateTime).tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('YYYY/MM/DD H:m:s')
  } else {
    return dateTime;
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
        if (obk === 'dealer_id')
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

export function getDateFromTimestamp(value) {
  function convert(str) {
    var month, day, year;
    var date  = new Date(str),
      month   = ("0" + (date.getMonth() + 1)).slice(-2),
      day     = ("0" + date.getDate()).slice(-2);


    var formatedDate = [date.getFullYear(),month, day].join("/");
    return formatedDate;
  }

  let date = new Date(value);
  let formattedDate = convert(date)
  return formattedDate;
}

export function convertTimestampToDate(value) {
  function convert(str) {
    return moment(str).format('DD-MM-YYYY')
  }

  let formattedDate = convert(value)
  return formattedDate;
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
export function checkRemainTermDays(createDate, endDate) {
  let startDate = moment()
  let lastDate = moment(endDate)
  console.log(lastDate - startDate);
  return lastDate.diff(startDate, "days")
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
  } else {
    return "N/A";
  }
}

export function handleMultipleSearch(e, copy_status, copyRequireSearchData, demoSearchValues, requireForSearch) {
  // handleMultipleSearch(e, this.state.copy_status, copyDevices, this.state.SearchValues, this.state.filteredDevices)

  // console.log("e, copy_status, copyRequireSearchData, demoSearchValues, requireForSearch ", e.target.value, copy_status, copyRequireSearchData, demoSearchValues, requireForSearch)

  let demoData = [];
  if (copy_status) {
    copyRequireSearchData = requireForSearch;
    copy_status = false;
  }

  let targetName = e.target.name;
  let targetValue = e.target.value;
  let searchColsAre = Object.keys(demoSearchValues).length;

  // console.log(demoSearchValues, 'value  is: ', targetValue)

  if (targetValue.length || Object.keys(demoSearchValues).length) {
    demoSearchValues[targetName] = { key: targetName, value: targetValue };

    copyRequireSearchData.forEach((obj) => {
      // console.log('device is: ', device);
      // if (obj[targetName] !== undefined) {

      let searchRecords = 0;

      if (searchColsAre > 0) {
        Object.values(demoSearchValues).forEach((data) => {

          if (obj[data.key] !== undefined && obj[data.key] !== null) {
            if (data.value == "") {
              searchRecords++;
            } else if (typeof (obj[data.key]) === 'string') {
              if (obj[data.key].toString().toUpperCase().includes(data.value.toString().toUpperCase())) {
                searchRecords++;
              }
            } else
              // if (obj[data.key] !== null) {
              if (isArray(obj[data.key])) {

                if (data.key == "devicesList") {
                  if (obj[data.key].length.toString().toUpperCase().includes(data.value.toString().toUpperCase())) {
                    searchRecords++;
                  }
                }

              } else if (obj[data.key].toString().toUpperCase().includes(data.value.toString().toUpperCase())) {
                searchRecords++;
              }
            // }
          }
        })

        if (searchColsAre === searchRecords) {
          demoData.push(obj);
        }
      }
      else {
        if (obj[targetName].toString().toUpperCase().includes(targetValue.toString().toUpperCase())) {
          demoData.push(obj);
        }
      }
      // }
      // else {
      //   // demoData.push(obj);
      // }
    });
    return {
      copy_status,
      copyRequireSearchData,
      demoData,
      SearchValues: demoSearchValues
    }
  } else {
    return {
      copy_status,
      copyRequireSearchData,
      demoData: copyRequireSearchData,
      SearchValues: demoSearchValues
    }
  }
}

export function filterData_RelatedToMultipleSearch(devices, SearchValues) {
  let searchedDevices = [];
  let searchData = Object.values(SearchValues);
  let searchColsAre = Object.keys(SearchValues).length;

  if (searchColsAre) {
    devices.forEach((device) => {
      let searchDevices = 0;

      for (let search of searchData) {
        // console.log('search is: ', search)
        // console.log('search key is: ', search.key)
        if (search.value == "") {
          searchDevices++;
        } else if (typeof (device[search.key]) === 'string') {
          if (device[search.key].toUpperCase().includes(search.value.toUpperCase())) {
            searchDevices++;
          }
        } else if (isArray(device[search.key])) {
          if (search.key == "devicesList") {
            if (device[search.key].length.toString().toUpperCase().includes(search.value.toUpperCase())) {
              searchDevices++;
            }
          }
        } else {
          if (device[search.key].toString().toUpperCase().includes(search.value.toUpperCase())) {
            searchDevices++;
          }
        }

      }
      if (searchColsAre === searchDevices) {
        searchedDevices.push(device);
      }

    });
    return searchedDevices;
  } else {
    return devices;
  }
}


export function findAndRemove_duplicate_in_array(arra1) {
  // console.log('array is: ', arra1)
  var object = {};
  var duplicateIds = [];

  arra1.forEach(function (item) {
    if (!object[item])
      object[item] = 0;
    object[item] += 1;
  })

  for (var prop in object) {
    if (object[prop] >= 2) {
      duplicateIds.push(Number(prop));
    }
  }

  let removeDuplicateIds = arra1.filter((item) => !duplicateIds.includes(item));
  return ([...removeDuplicateIds, ...duplicateIds]);

}


export function removeDuplicateObjects(originalArray, prop) {
  var newArray = [];
  var lookupObject  = {};

  for(var i in originalArray) {
     lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for(i in lookupObject) {
      newArray.push(lookupObject[i]);
  }
   return newArray;
}
export function generatePDF(columns, rows, title, fileName, formData) {

  let y   = 15;
  let x   = 20;
  var doc = new jsPDF('p', 'pt');
  doc.setFontSize(16);
  doc.setTextColor(40);
  doc.setFontStyle('normal');
  doc.text(title, y, x);

  if (formData.product){
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    doc.text('Product: ' + formData.product, y, x+=15);
  }

  if (formData.payment_status){
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    doc.text('Payment Status: ' + formData.payment_status, y, x+=15);
  }

  if (formData.type){
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    doc.text('Product Type: ' + formData.type, y, x+=15);
  }

  if (formData.transaction_type){
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    doc.text('Transaction Type: ' + formData.transaction_type, y, x+=15);
  }

  if (formData.from){
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    doc.text('From: ' + convertTimestampToDate(formData.from), y, x+=15);
  }

  if (formData.to){
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    doc.text('To: ' + convertTimestampToDate(formData.to), y, x+=15);
  }

  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.setFontStyle('normal');
  doc.text('Total Records: ' + rows.length, y, x+=15);


  doc.autoTable(columns, rows, {
    startY: doc.autoTableEndPosY() + x+15,
    margin: { horizontal: 10 },
    styles: { overflow: 'linebreak' },
    bodyStyles: { valign: 'top' },
    theme: "striped"
  });

  doc.save(fileName+'.pdf');
}



export function generateExcel(rows, fileName) {
  var wb          = XLSX.utils.book_new();
  let ws          = XLSX.utils.json_to_sheet(rows);
  let fileNameCSV = fileName + ".xlsx";

  XLSX.utils.book_append_sheet(wb, ws, 'Devices');
  console.log(wb);
  XLSX.writeFile(wb, fileNameCSV)

}

export function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};
