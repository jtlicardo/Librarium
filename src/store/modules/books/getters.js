export default {
  allBooks(state) {
    return state.books
  },
  filteredBooks(_, getters, _2, rootGetters) {
    const allBooks = getters.allBooks
    const searchInput = rootGetters.searchInput
    const bookResults = []

    function arrSearch(array, x) {
      let mappedArray = array.map((el) => el.toUpperCase())
      let uppercasedTerm = x.toUpperCase()
      for (let i = 0; i < mappedArray.length; i++) {
        if (mappedArray[i].includes(uppercasedTerm)) return true
      }
    }

    for (let i = 0; i < allBooks.length; i++) {
      const bookTitle = allBooks[i].title.toUpperCase()
      const bookAuthor = allBooks[i].author.toUpperCase()
      const bookGenres = allBooks[i].genres
      const searchTitle = searchInput.title.toUpperCase()
      const searchAuthor = searchInput.author.toUpperCase()
      const searchGenre = searchInput.genre
      const titleMatches = bookTitle.includes(searchTitle)
      const authorMatches = bookAuthor.includes(searchAuthor)
      const genreMatches = arrSearch(bookGenres, searchGenre)
      if (titleMatches && authorMatches && genreMatches) {
        bookResults.push(allBooks[i])
      }
    }
    return bookResults
  },
}
