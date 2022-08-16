import http from 'http';
import express from 'express';
import  'dotenv/config'

console.log(process.env.password);
// setTimeout(() => {

//     console.log('here')
// }, 0);
// console.log('here')

const first = (()=>{
console.log('first this ');
},console.log('after callback'),()=>console.log("in the end "))()