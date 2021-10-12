# CD_ASSIGNMENT_1
This repository contains code for Cyberdefense(FALL 2021) Assignment 1. Following is the description of various files.

* The `*.js` files contains the code that helps us to find the tables and the password corresponding to the user **tom**.

* The `.txt` files contains the output of our operation.

* The `package*.json` are configuration files that store information related to the dependencies.

## Setup

Clone/Download the repository and navigate to the root of the project. The scripts are guranteed to work with Node version > 16.9.1. Please download appropriate version with [NVM](https://github.com/nvm-sh/nvm) or directly from Node's official site.

Please install the dependencies once `node` is available.
`npm install`

## Running

### Finding the tables and columns

The script `assignment1.js` is responsible for listing all the tables and columns present in the Database. The script requires two command line arguments in order to start.

`node assignment1.js start end`

The input for `start` and `end` must conform to following constrains. The program will exit without running if the validation fails on start and end.

* Valid range for start: 0-121 
* Valid range for end: 1-122 
* Start must be **less than end** for the script to run

`assignment1.js` writes the output on the Standard Output, which can be easily piped to a text fileon bash.

`node assignment1.js start end &>out.txt` 

Running `assignment1.js` is a time consuming process when the difference between *start* and *end* is significant. 

### Finding the password

The output from the `assignment1.js` can be analyzed to find a column named **PASSWORD**. These tables and columns were used in `getPassword.js` to figure out the password for **tom**. These tables are already present in the `getPassword.js` file. Now we can run this file to figure out the password fort tom.

`node getPassword.js`

This is the output of the above operation.

```
Table name and column name respectively CHALLENGE_USERS USERID
Password length : 23
t
th
thi
this
thisi
thisis
thisisa
thisisas
thisisase
thisisasec
thisisasecr
thisisasecre
thisisasecret
thisisasecretf
thisisasecretfo
thisisasecretfor
thisisasecretfort
thisisasecretforto
thisisasecretfortom
thisisasecretfortomo
thisisasecretfortomon
thisisasecretfortomonl
thisisasecretfortomonly
```
