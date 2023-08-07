const { check, validationResult } = require("express-validator");
const express = require("express");
const { isAbsolute } = require("path");
const path = require("path");

const provinces = [
  "NL",
  "PE",
  "NS",
  "NB",
  "QC",
  "ON",
  "MB",
  "SK",
  "AB",
  "BC",
  "YT",
  "NT",
  "NU",
];
var item = 0;

var myApp = express();

myApp.use(express.static("public"));
myApp.use(express.urlencoded({ extended: false }));
myApp.set("views", path.join(__dirname, "views"));
myApp.set("view engine", "ejs");

myApp.get("/", function (req, res) {
  res.render("home");
});

myApp.post(
  "/",
  [
    check("name", "Must have a name").notEmpty(),
    check("address", "Must have an address").notEmpty(),
    check("city", "Must have a city").notEmpty(),
    check("province", "Invalid province. e.g: ON, BC, QC, etc...").custom(
      (value) => {
        return provinces.includes(value);
      }
    ),
    check("phone", "Must be a valid phone number. e.g: 5192577558").matches(
      /^\d{10}$/
    ),
    check("email", "Must have a valid email").isEmail(),
    check(
      "jeep",
      "Must have a Qty of Jeep Cap or Nissan Cap to purchase"
    ).custom((value, { req }) => {
      return parseInt(value) || parseInt(req.body.nissan) ? true : false;
    }),
    check(
      "nissan",
      "Must have a Qty of Jeep Cap or Nissan Cap to purchase"
    ).custom((value, { req }) => {
      return parseInt(value) || parseInt(req.body.jeep) ? true : false;
    }),
    // check("jeep", "").custom((value, { req }) => {
    //   if (value.notEmpty() && req.body.nissan.isEmpty()) {
    //     item = 1;
    //   } else if (req.body.nissan.notEmpty() && value.isEmpty()) {
    //     item = 2;
    //   } else if (req.body.nissan.notEmpty() && value.notEmpty()) {
    //     item = 3;
    //   }
    //   return true;
    // }),
    // check("nissan", "Total price must be greater than $10").custom(
    //   (value, { req }) => {
    //     if (item === 1) {
    //       return parseFloat(value) * 4.5 > 10;
    //     } else if (item === 2) {
    //       return parseFloat(req.body.jeep) * 5.75 > 10;
    //     } else if (item === 3) {
    //       return (
    //         parseFloat(req.body.jeep) * 5.75 + parseFloat(value) * 4.5 > 10
    //       );
    //     }
    //   }
    // ),
  ],

  function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("home", { errors: errors.array() });
    } else {
      var name = req.body.name;
      var address = req.body.address;
      var city = req.body.city;
      var province = req.body.province;
      var phone = req.body.phone;
      var email = req.body.email;
      var jeep = req.body.jeep;
      var nissan = req.body.nissan;
      let priceItem1 = 5.75;
      let priceItem2 = 4.5;

      let item = 0;
      if (req.body.jeep.trim() != "" && req.body.nissan.trim() === "") {
        item = 1;
      } else if (req.body.nissan.trim() != "" && req.body.jeep.trim() === "") {
        item = 2;
      } else if (req.body.jeep.trim() != "" && req.body.nissan.trim() != "") {
        item = 3;
      }
      var tax = 0;
      switch (province) {
        case "AB":
          tax = 0.05;
          break;
        case "BC":
          tax = 0.12;
          break;
        case "MB":
          tax = 0.12;
          break;
        case "NB":
          tax = 0.15;
          break;
        case "NL":
          tax = 0.15;
          break;
        case "NT":
          tax = 0.05;
          break;
        case "NS":
          tax = 0.15;
          break;
        case "NU":
          tax = 0.05;
          break;
        case "ON":
          tax = 0.13;
          break;
        case "PE":
          tax = 0.15;
          break;
        case "QC":
          tax = 0.149;
          break;
        case "SK":
          tax = 0.11;
          break;
        case "YT":
          tax = 0.05;
          break;
      }

      if (item === 1) {
        nissan = 0;
        if (parseFloat(jeep) * 5.75 >= 10) {
          let itemName1 = "Jeep Cap";

          res.render("receipt", {
            name: name,
            address: address,
            city: city,
            province: province,
            phone: phone,
            email: email,
            jeep: jeep,
            nissan: nissan,
            tax: tax,
            item: item,
            itemName1: itemName1,
            priceItem1: priceItem1,
          });
        } else {
          res.render("home", {
            errors: [
              {
                value: jeep,
                msg: "Total price must be greater than $10",
                param: "jeep",
                location: "body",
              },
            ],
          });
        }
      } else if (item === 2) {
        jeep = 0;
        if (parseFloat(nissan) * 4.5 >= 10) {
          let itemName2 = "Nissan Cap";

          res.render("receipt", {
            name: name,
            address: address,
            city: city,
            province: province,
            phone: phone,
            email: email,
            jeep: jeep,
            nissan: nissan,
            tax: tax,
            item: item,
            itemName2: itemName2,
            priceItem2: priceItem2,
          });
        } else {
          res.render("home", {
            errors: [
              {
                value: nissan,
                msg: "Total price must be greater than $10",
                param: "nissan",
                location: "body",
              },
            ],
          });
        }
      } else if (item === 3) {
        if (parseFloat(jeep) * 5.75 + parseFloat(nissan) * 4.5 >= 10) {
          let itemName1 = "Jeep Cap";
          let itemName2 = "Nissan Cap";

          res.render("receipt", {
            name: name,
            address: address,
            city: city,
            province: province,
            phone: phone,
            email: email,
            jeep: jeep,
            nissan: nissan,
            tax: tax,
            item: item,
            itemName1: itemName1,
            itemName2: itemName2,
            priceItem1: priceItem1,
            priceItem2: priceItem2,
          });
        }
      }
    }
  }
);

myApp.listen(8080);
console.log("Everthing executed fine.. Open http://localhost:8080/");
