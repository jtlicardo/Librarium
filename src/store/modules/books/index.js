import mutations from "./mutations.js"
import actions from "./actions.js"
import getters from "./getters.js"

export default {
  namespaced: true,
  state() {
    return {
      books: [
        {
          id: "b1",
          title: "Crime and Punishment",
          author: "Fyodor Dostoevsky",
          logo: require("@/assets/book_logos/cap.jpg"),
          genres: ["Fiction", "Russian literature"],
          page_num: 671,
          added_date: new Date("2021-11-15"),
          copies: [
            {
              id: "c1",
              inventory_num: "76921",
              status: "available",
            },
            {
              id: "c2",
              inventory_num: "89832",
              status: "available",
            },
            {
              id: "c3",
              inventory_num: "26008",
              status: "reserved",
            },
            {
              id: "c4",
              inventory_num: "671889",
              status: "loaned",
            },
          ],
        },
        {
          id: "b2",
          title: "Harry Potter and the Sorcerer's Stone",
          author: "J.K. Rowling",
          logo: require("@/assets/book_logos/harrypotter.jpg"),
          genres: ["Fiction", "Fantasy"],
          page_num: 309,
          added_date: new Date("2021-11-16"),
          copies: [
            {
              id: "c1",
              inventory_num: "76921",
              status: "available",
            },
          ],
        },
        {
          id: "b3",
          title: "Steve Jobs",
          author: "Walter Isaacson",
          logo: require("@/assets/book_logos/stevejobs.jpg"),
          genres: ["Biography", "Nonfiction"],
          page_num: 627,
          added_date: new Date("2021-11-17"),
          copies: [
            {
              id: "c1",
              inventory_num: "76921",
              status: "available",
            },
            {
              id: "c2",
              inventory_num: "76921",
              status: "available",
            },
            {
              id: "c3",
              inventory_num: "76921",
              status: "reserved",
            },
          ],
        },
        {
          id: "b4",
          title: "Sapiens: A Brief History of Humankind",
          author: "Yuval Noah Harari",
          logo: require("@/assets/book_logos/sapiens.jpg"),
          genres: ["Nonfiction", "History", "Science"],
          page_num: 512,
          added_date: new Date("2021-11-18"),
          copies: [
            {
              id: "c1",
              inventory_num: "76921",
              status: "available",
            },
            {
              id: "c2",
              inventory_num: "76921",
              status: "loaned",
            },
          ],
        },
      ],
    }
  },
  mutations,
  actions,
  getters,
}
