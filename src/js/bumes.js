!function(c){function e(e){for(var n,t,r=e[0],o=e[1],i=0,u=[];i<r.length;i++)t=r[i],a[t]&&u.push(a[t][0]),a[t]=0;for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(c[n]=o[n]);for(f&&f(e);u.length;)u.shift()()}var t={},a={1:0,3:0};function o(e){if(t[e])return t[e].exports;var n=t[e]={i:e,l:!1,exports:{}};return c[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.e=function(i){var e=[],t=a[i];if(0!==t)if(t)e.push(t[2]);else{var n=new Promise(function(e,n){t=a[i]=[e,n]});e.push(t[2]=n);var r,u=document.createElement("script");u.charset="utf-8",u.timeout=120,o.nc&&u.setAttribute("nonce",o.nc),u.src=function(e){return o.p+""+({}[e]||e)}(i),r=function(e){u.onerror=u.onload=null,clearTimeout(c);var n=a[i];if(0!==n){if(n){var t=e&&("load"===e.type?"missing":e.type),r=e&&e.target&&e.target.src,o=new Error("Loading chunk "+i+" failed.\n("+t+": "+r+")");o.type=t,o.request=r,n[1](o)}a[i]=void 0}};var c=setTimeout(function(){r({type:"timeout",target:u})},12e4);u.onerror=u.onload=r,document.head.appendChild(u)}return Promise.all(e)},o.m=c,o.c=t,o.d=function(e,n,t){o.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(n,e){if(1&e&&(n=o(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var t=Object.create(null);if(o.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var r in n)o.d(t,r,function(e){return n[e]}.bind(null,r));return t},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,"a",n),n},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},o.p="dist/js",o.oe=function(e){throw console.error(e),e};var n=window.webpackJsonp=window.webpackJsonp||[],r=n.push.bind(n);n.push=e,n=n.slice();for(var i=0;i<n.length;i++)e(n[i]);var f=r;o(o.s=1)}([,function(e,n,t){"use strict";t.r(n),t.d(n,"default",function(){return r}),t.d(n,"Worst",function(){return r});var r=function e(n){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),console.log("worst init done"),t.e(4).then(t.bind(null,0)).then(function(e){var n=new e.Dog;console.log(n)})}}]);