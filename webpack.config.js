import path from path;

module.exports = {
  entry: './src/main.js', 
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node', 
  mode: 'production',
};
