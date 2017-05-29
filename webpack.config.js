module.exports ={

  entry: './js/app02.js',

  output: {
    path:'./dist',
    filename:'bundle.js'
  },
module:{
  loaders:[
    {
      test: /\.js$/,
      loader: 'babel',
      exclude: '/node_modules'
    }

  ]
}

}
