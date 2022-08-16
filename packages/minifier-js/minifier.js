let terser;

const terserMinify = async (source, options, callback) => {
  terser = terser || Npm.require("terser");
  try {
    const result = await terser.minify(source, options);
    return callback(null, result);
  } catch (e) {
    return callback(e);
  }
};

export const meteorJsMinify = function (source) {
  const result = {};
  const NODE_ENV = process.env.NODE_ENV || "development";


  const options = {
    compress: {
      drop_debugger: false,  // remove debugger; statements
      unused: false,         // drop unreferenced functions and variables
      dead_code: true,       // remove unreachable code
      typeofs: false,        // set to false due to known issues in IE10
      global_defs: {
        "process.env.NODE_ENV": NODE_ENV
      }
    },
    // Fix issue #9866, as explained in this comment:
    // https://github.com/mishoo/UglifyJS2/issues/1753#issuecomment-324814782
    // And fix terser issue #117: https://github.com/terser-js/terser/issues/117
    safari10: true,          // set this option to true to work around the Safari 10/11 await bug
  };

  const terserJsMinify = Meteor.wrapAsync(terserMinify);
  let terserResult;
  try {
    terserResult = terserJsMinify(source, options);
  } catch (e) {
    throw e;
  }

  // this is kept to maintain backwards compatability
  result.code = terserResult.code;
  result.minifier = 'terser';

  return result;
};



export const meteorJsMinifyAsync = async function (source) {
  const NODE_ENV = process.env.NODE_ENV || "development";
  terser = terser || Npm.require("terser");

  const options = {
    compress: {
      drop_debugger: false,  // remove debugger; statements
      unused: false,         // drop unreferenced functions and variables
      dead_code: true,       // remove unreachable code
      typeofs: false,        // set to false due to known issues in IE10
      global_defs: {
        "process.env.NODE_ENV": NODE_ENV
      }
    },
    // Fix issue #9866, as explained in this comment:
    // https://github.com/mishoo/UglifyJS2/issues/1753#issuecomment-324814782
    // And fix terser issue #117: https://github.com/terser-js/terser/issues/117
    safari10: true,          // set this option to true to work around the Safari 10/11 await bug
  };


  try {
    const terserResult = await terser.minify(source, options);
    return {
      code: terserResult.code,
      minifier: "terser"
    };
  } catch (e) {
    throw e;
  }
};
