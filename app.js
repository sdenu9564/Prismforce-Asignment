//install and import express for run the server
const express=require('express');
const merge = require('nodemon/lib/utils/merge');
//import file system to create a file
const fs=require('fs');
const app=express();
//import the input file and make sure the name is correct
const input=require('./input/input.json');
const { totalmem } = require('os');

// the main function
totalAmount=(req,res)=>{
  //taking the exprnsedata from input
    var expensedata=input.expenseData;
    //taking the revenue data from input
    var revenueData=input.revenueData;

  //sort the expense data according to date
    const sortByDateExpense = expensedata => {
        const sorter = (a, b) => {
           return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        expensedata.sort(sorter);
    };
    sortByDateExpense(expensedata);

    //sort the revenue data according to date
    const sortByDateRevenue = revenueData => {
        const sorter = (a, b) => {
           return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
        revenueData.sort(sorter);
    };
    sortByDateRevenue(revenueData);

//merege revenue data if same date is exist in obj1
var holder = {};

revenueData.forEach(function(d) {
  if (holder.hasOwnProperty(d.startDate)) {
    holder[d.startDate] = holder[d.startDate] + d.amount;
  } else {
    holder[d.startDate] = d.amount;
  }
});

var obj1 = [];

for (var prop in holder) {
  obj1.push({ startDate: prop, amount: holder[prop] });
}

//merge expense data if same date is exist in obj2

var holder1 = {};

expensedata.forEach(function(d) {
  if (holder1.hasOwnProperty(d.startDate)) {
    holder1[d.startDate] = -(holder1[d.startDate] + d.amount);
  } else {
    holder1[d.startDate] = -(d.amount);
  }
});

var obj2 = [];

for (var prop in holder1) {
  obj2.push({ startDate: prop, amount: holder1[prop] });
}

//merge expense and revenue data
const merge=[...obj1,...obj2]



//total calculation
var holder3 = {};

merge.forEach(function(d) {
  if (holder3.hasOwnProperty(d.startDate)) {
    holder3[d.startDate] = holder3[d.startDate] + d.amount;
  } else {
    holder3[d.startDate] = d.amount;
  }
});

var obj3 = [];

for (var prop in holder3) {
  obj3.push({ startDate: prop, amount: holder3[prop] });
}

//Again sort the data by date
const sortByDateObj = obj3 => {
  const sorter = (a, b) => {
     return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }
  obj3.sort(sorter);
};
sortByDateObj(obj3);


//check and add if any date is missing in between start month and end maonth
const getDates = (startDate, stopDate) => {
  const dateArray = [];
  let counterDate = startDate;
  const stopCounter = new Date(stopDate.setMonth(stopDate.getMonth() -1));
  while (counterDate < stopCounter) {
dateArray.push(counterDate);
counterDate = new Date(counterDate.setMonth(counterDate.getMonth() + 1));
  }
  return dateArray;
}
let k = 1;
const result = [];
while (k < obj3.length) {
  const inBetween = getDates(new Date(obj3[k - 1].startDate),new Date(obj3[k].startDate)).map(date => ({
startDate: date.toISOString(),
amount: 0
  }));
  if (inBetween.length > 0) {
result.push(...inBetween)
  }
  if (k === obj3.length - 1) {
result.push(obj3[k]);
  }
  k++;
}

//now merge the missing object with zero value
const amount=[...obj3,...result]
const sortByDateAmount = amount => {
  const sorter = (a, b) => {
     return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }
  amount.sort(sorter);
};
sortByDateAmount(amount);
//now get the unique object in the array
let newamount=[];
let uniqueObject = {};
for (let i in amount) {
      
  // Extract the title
  objTitle = amount[i]['startDate'];

  // Use the title as the index
  uniqueObject[objTitle] = amount[i];
}
for (i in uniqueObject) {
  newamount.push(uniqueObject[i]);
}

//craeting a output.json and push the data into this file
var newData = JSON.stringify(newamount);
//chane the output.json to your output file name
fs.writeFile('output.json', newData, err => {
    // error checking
    if(err) throw err;
    
    console.log("New data added");
});  



}
//call the function
totalAmount();

app.listen();
