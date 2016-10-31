let url = 'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_UY1200_CR88,0,630,1200_AL_.jpg';

let pattern = /(https?:\/\/images-na\.ssl-images-amazon\.com\/images\/M\/.+@\._V1_UY\d{1,5}_CR\d{1,4},0,)\d{1,4}(,\d{1,5}_AL_\.jpg)/;
let newPoster = url.replace(pattern, '$1800$2');

let matches = url.match(pattern);

let result = url.replace(pattern, '$1800$2');
console.log(result);