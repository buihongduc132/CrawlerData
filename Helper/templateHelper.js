module.exports = {
    movieListByGenre: function(genre, page) {
        return `http://www.imdb.com/search/title?genres=${genre}&sort=user_rating,desc&title_type=feature&num_votes=25000,&pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=2406822102&pf_rd_r=1V8KNKKMTGS5AFZ0F8HH&pf_rd_s=right-6&pf_rd_t=15506&pf_rd_i=top&ref_=chttp_gnr_1&page=${page}`;
    }
}