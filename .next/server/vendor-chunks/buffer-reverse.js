/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/buffer-reverse";
exports.ids = ["vendor-chunks/buffer-reverse"];
exports.modules = {

/***/ "(ssr)/./node_modules/buffer-reverse/index.js":
/*!**********************************************!*\
  !*** ./node_modules/buffer-reverse/index.js ***!
  \**********************************************/
/***/ ((module) => {

eval("module.exports = function reverse(src) {\n    var buffer = new Buffer(src.length);\n    for(var i = 0, j = src.length - 1; i <= j; ++i, --j){\n        buffer[i] = src[j];\n        buffer[j] = src[i];\n    }\n    return buffer;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZXJrbGUvLi9ub2RlX21vZHVsZXMvYnVmZmVyLXJldmVyc2UvaW5kZXguanM/MmVhYiJdLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHJldmVyc2UgKHNyYykge1xuICB2YXIgYnVmZmVyID0gbmV3IEJ1ZmZlcihzcmMubGVuZ3RoKVxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gc3JjLmxlbmd0aCAtIDE7IGkgPD0gajsgKytpLCAtLWopIHtcbiAgICBidWZmZXJbaV0gPSBzcmNbal1cbiAgICBidWZmZXJbal0gPSBzcmNbaV1cbiAgfVxuXG4gIHJldHVybiBidWZmZXJcbn1cbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwicmV2ZXJzZSIsInNyYyIsImJ1ZmZlciIsIkJ1ZmZlciIsImxlbmd0aCIsImkiLCJqIl0sIm1hcHBpbmdzIjoiQUFBQUEsT0FBT0MsT0FBTyxHQUFHLFNBQVNDLFFBQVNDLEdBQUc7SUFDcEMsSUFBSUMsU0FBUyxJQUFJQyxPQUFPRixJQUFJRyxNQUFNO0lBRWxDLElBQUssSUFBSUMsSUFBSSxHQUFHQyxJQUFJTCxJQUFJRyxNQUFNLEdBQUcsR0FBR0MsS0FBS0MsR0FBRyxFQUFFRCxHQUFHLEVBQUVDLEVBQUc7UUFDcERKLE1BQU0sQ0FBQ0csRUFBRSxHQUFHSixHQUFHLENBQUNLLEVBQUU7UUFDbEJKLE1BQU0sQ0FBQ0ksRUFBRSxHQUFHTCxHQUFHLENBQUNJLEVBQUU7SUFDcEI7SUFFQSxPQUFPSDtBQUNUIiwiZmlsZSI6Iihzc3IpLy4vbm9kZV9tb2R1bGVzL2J1ZmZlci1yZXZlcnNlL2luZGV4LmpzIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/buffer-reverse/index.js\n");

/***/ })

};
;